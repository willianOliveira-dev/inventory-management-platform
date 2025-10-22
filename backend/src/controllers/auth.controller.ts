import AuthService from '@services/auth.service';
import UserService from '@services/user.service';
import createResponse from '@utils/createResponse';
import AuthSchema from '@validations/auth.schema';
import { AuthResponseCode } from 'constants/responsesCode/auth';
import { UserSchema } from '@validations/user.schema';
import { UserResponseCode } from 'constants/responsesCode/user';
import type { AuthTokens, User, ValidateRequest } from 'types';
import { type Payload } from 'types/express/express';
import type { Request, Response } from 'express';

const authService: AuthService = new AuthService();

/**
 * Controller responsible for handling authentication-related HTTP requests.
 * Includes user registration, login, logout, getMe and token refresh operations.
 */

export default class AuthController {
    public async logout(req: Request<{}, {}, AuthTokens>, res: Response) {
        /**
         * Logs out the user by invalidating the refresh token and clearing the cookie.
         *
         * @param req - Express request containing the refresh token in cookies.
         * @param res - Express response used to clear the cookie and return status.
         * @returns HTTP 200 with a success message.
         */

        const refreshTokenRaw: string = req.cookies.refreshToken;

        if (refreshTokenRaw) {
            await authService.logout(refreshTokenRaw);
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            path: '/panel/v1/auth/refresh',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });

        const response = createResponse(
            'success',
            AuthResponseCode.USER_LOGGED_OUT,
            200,
            'Usuário desconectado com sucesso.'
        );

        return res.status(200).json(response);
    }

    public async register(
        req: ValidateRequest<typeof UserSchema>,
        res: Response
    ) {
        /**
         * Registers a new user and immediately logs them in.
         * Sets a secure HttpOnly refresh token cookie and returns an access token.
         *
         * @param req - Express request containing validated user registration data.
         * @param res - Express response used to set cookies and return user info.
         * @returns HTTP 201 with user data and access token.
         */

        const { name, email, password } = req.body;

        const user: User = await authService.register(name, email, password);

        const { accessToken, refreshToken } = await authService.login(
            email,
            password
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/panel/v1/auth/refresh',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        const data = {
            user,
            accessToken,
        };

        const response = createResponse(
            'success',
            AuthResponseCode.USER_REGISTERED,
            201,
            'Usuário registrado com sucesso.',
            data
        );

        return res.status(201).json(response);
    }

    public async login(req: ValidateRequest<typeof AuthSchema>, res: Response) {
        /**
         * Authenticates a user and returns an access token.
         * Sets a secure HttpOnly refresh token cookie.
         *
         * @param req - Express request containing validated login credentials.
         * @param res - Express response used to set cookies and return user info.
         * @returns HTTP 200 with user data and access token.
         */
        const { email, password } = req.body;

        const user: User = await new UserService().getUserByEmail(email);

        const { password: _, constructor, ...safeUser } = user;

        const { accessToken, refreshToken } = await authService.login(
            email,
            password
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/panel/v1/auth/refresh',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        const data = {
            user: safeUser,
            accessToken,
        };

        const response = createResponse(
            'success',
            AuthResponseCode.USER_LOGGED_IN,
            200,
            'Usuário conectado com sucesso.',
            data
        );

        return res.json(response);
    }

    public async getMe(req: Request, res: Response) {
        /**
         * Returns the current user's data based on the JWT token
         *
         * @param req - Request containing the user authenticated in the middleware
         * @param res - Response with user data
         * @returns HTTP 200 with user data
         */
        const { user_id } = req.user as Payload;
        const user: User = await new UserService().getUserById(user_id);

        res.status(200).json(
            createResponse(
                'success',
                UserResponseCode.USER_FETCH_SUCCESS,
                200,
                'Dados do usuário recuperados com sucesso.',
                user
            )
        );
    }

    public async refresh(req: Request<{}, {}, AuthTokens>, res: Response) {
        /**
         * Refreshes the access token using a valid refresh token.
         * Sets a new secure HttpOnly refresh token cookie.
         *
         * @param req - Express request containing the refresh token in the body.
         * @param res - Express response used to set cookies and return the new access token.
         * @returns HTTP 200 with a new access token.
         */
        const refreshTokenRaw: string = req.cookies.refreshToken;

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await authService.refresh(refreshTokenRaw);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/panel/v1/auth/refresh',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        const response = createResponse(
            'success',
            AuthResponseCode.ACCESS_TOKEN_REFRESHED,
            200,
            'Token de acesso atualizado com sucesso.',
            newAccessToken
        );

        return res.status(200).json(response);
    }
}
