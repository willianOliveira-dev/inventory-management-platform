import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserService from '@services/user.service';
import RefreshTokenService from './refreshToken.service';
import UnauthorizedError from '@errors/http/UnauthorizedError';
import handleServiceError from '@utils/handleServiceError';
import { v4 as uuidv4 } from 'uuid';
import type {
    Payload,
    PayloadRefresh,
    RefreshToken,
    AuthTokens,
    User,
} from 'types';
import { AuthResponseCode } from 'constants/responsesCode/auth';

const refreshTokenService: RefreshTokenService = new RefreshTokenService();

/**
 * Service responsible for handling authentication logic,
 * including user registration, login, logout, and token refresh.
 * Manages JWT generation and validation, and interacts with the refresh token store.
 */

export default class AuthService {
    private generateAccessToken(payload: Payload): string {
        /**
         * Generates a short-lived JWT access token.
         *
         * @param payload - User identification payload.
         * @returns A signed JWT access token valid for 15 minutes.
         */

        return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
            expiresIn: '15m',
        });
    }

    private generateRefreshToken(payload: PayloadRefresh): string {
        /**
         * Generates a long-lived JWT refresh token.
         *
         * @param payload - Payload including user info and token ID.
         * @returns A signed JWT refresh token valid for 7 days.
         */

        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
            expiresIn: '7d',
        });
    }

    public async register(name: string, email: string, password: string) {
        /**
         * Registers a new user in the system.
         *
         * @param name - User's name.
         * @param email - User's email.
         * @param password - User's password.
         * @returns The newly created user object.
         */
        const user: User = await new UserService().createUser({
            name,
            email,
            password,
        });

        return user;
    }

    public async login(email: string, password: string): Promise<AuthTokens> {
        /**
         * Authenticates a user and returns access and refresh tokens.
         * Validates password, generates tokens, and stores hashed refresh token.
         *
         * @param email - User's email.
         * @param password - User's password.
         * @returns Object containing accessToken and refreshToken.
         * @throws UnauthorizedError if password is invalid.
         */

        const user: User = await new UserService().getUserByEmail(email);

        const isValidPassword: boolean = await bcrypt.compare(
            password,
            user.password
        );

        if (!isValidPassword) {
            throw new UnauthorizedError(
                'A senha fornecida está incorreta.',
                AuthResponseCode.AUTH_INVALID_PASSWORD
            );
        }

        const payload: Payload = {
            user_id: user.user_id,
            email: user.email,
        };

        const accessToken: string = this.generateAccessToken(payload);

        const token_id: string = uuidv4();

        // Explanation: When generating the refresh token, we include the tokenId in the payload. This way, upon receiving the refresh token, the backend decodes it and already knows which DB record to check (avoiding inefficient user searches).
        const payloadRefresh: PayloadRefresh = {
            ...payload,
            token_id,
        };
        const refreshToken: string = this.generateRefreshToken(payloadRefresh);

        const expires_at: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        try {
            // save refresh token hash in the bank
            await refreshTokenService.save(
                token_id,
                user.user_id,
                refreshToken,
                expires_at
            );
        } catch (error: unknown) {
            handleServiceError(error, 'Tentativa de login malsucedida.');
        }

        return { accessToken, refreshToken };
    }

    public async logout(refreshTokenRaw: string): Promise<boolean> {
        /**
         * Logs out the user by deleting the refresh token from the database.
         * If the token is invalid or already deleted, returns success (idempotent).
         *
         * @param refreshTokenRaw - Raw refresh token from client.
         * @returns True if logout was processed.
         */

        try {
            const payload: any = jwt.verify(
                refreshTokenRaw,
                process.env.JWT_REFRESH_SECRET!
            );
            const tokenId: string = payload.token_id;

            await refreshTokenService.destroy(tokenId);

            return true;
        } catch (error: unknown) {
            return true;
        }
    }

    public async refresh(refreshTokenRaw: string): Promise<AuthTokens> {
        /**
         * Refreshes the access token using a valid refresh token.
         * Validates the token, checks its existence in the database, verifies integrity,
         * revokes reused or invalid tokens, and issues new access and refresh tokens.
         *
         * @param refreshTokenRaw - Raw refresh token received from the client.
         * @returns A Promise that resolves to an object containing the new accessToken and refreshToken.
         * @throws UnauthorizedError if the token is missing, invalid, revoked, reused, or does not match the stored hash.
         */

        if (!refreshTokenRaw) {
            throw new UnauthorizedError(
                'Sem token de atualização.',
                AuthResponseCode.TOKEN_MISSING
            );
        }

        let payload;

        try {
            payload = jwt.verify(
                refreshTokenRaw,
                process.env.JWT_REFRESH_SECRET!
            );
        } catch (error: unknown) {
            throw new UnauthorizedError(
                'Token de atualização inválido.',
                AuthResponseCode.AUTH_INVALID_REFRESH_TOKEN
            );
        }

        const { token_id, user_id, email } = payload as PayloadRefresh;

        const tokenRow: RefreshToken = await refreshTokenService.findByTokenId(
            token_id
        );

        if (!tokenRow) {
            // Token signed, but doesn't exist in the database -> possible theft/reuse
            // Safe action: revoke all user tokens and force login
            await refreshTokenService.revokeAllForUser(user_id);
            throw new UnauthorizedError(
                'Reutilização de token de atualização detectada ou origem desconhecida. Todas as sessões foram revogadas.',
                AuthResponseCode.SECURITY_TOKEN_REUSED
            );
        }

        if (tokenRow.revoked) {
            // possible attack (token already revoked and is being reused)
            await refreshTokenService.revokeAllForUser(user_id);
            throw new UnauthorizedError(
                'O token de atualização foi revogado. Todas as sessões foram revogadas.',
                AuthResponseCode.SECURITY_TOKEN_REUSED
            );
        }

        const match: boolean = await bcrypt.compare(
            refreshTokenRaw,
            tokenRow.token
        );

        // Verify hash (compare raw token with saved hash)
        if (!match) {
            await refreshTokenService.revokeAllForUser(user_id);
            throw new UnauthorizedError(
                'O token de atualização foi revogado. Todas as sessões foram revogadas.',
                AuthResponseCode.SECURITY_TOKEN_REUSED
            );
        }

        // All ok -> route: generate new access + new refresh token
        const newPayload: Payload = { user_id, email };

        const newAccessToken: string = this.generateAccessToken(newPayload);

        const newTokenId: string = uuidv4();
        const newPayloadRefresh: PayloadRefresh = {
            user_id,
            email,
            token_id: newTokenId,
        };

        const newRefreshToken: string =
            this.generateRefreshToken(newPayloadRefresh);

        const newExpiresAt: Date = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        // Saves new refresh and revokes the old one
        await refreshTokenService.save(
            newTokenId,
            user_id,
            newRefreshToken,
            newExpiresAt
        );

        //  set replaced_by=newTokenId to track
        await refreshTokenService.revokeByTokenId(token_id, newTokenId);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}
