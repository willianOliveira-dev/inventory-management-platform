import RefreshTokenModel from '@models/RefreshTokenModel';
import encryptToken from '@utils/encrypt';
import handleServiceError from '@utils/handleServiceError';
import type { RefreshToken } from 'types';

const refreshTokenModel: RefreshTokenModel = new RefreshTokenModel();

export default class RefreshTokenService {
    public async save(
        tokenId: string,
        userId: string,
        rawToken: string,
        expiresAt: Date
    ): Promise<RefreshToken> {
        try {
            const tokenValuesArray = [
                tokenId,
                userId,
                await encryptToken(rawToken),
                false,
                null,
                new Date(),
                expiresAt,
                null,
            ];

            const [newToken]: RefreshToken[] = await refreshTokenModel.save(
                tokenValuesArray
            );

            return newToken;
        } catch (error: unknown) {
            handleServiceError(error, 'Failed to save refresh token');
        }
    }

    public async findByTokenId(tokenId: string): Promise<RefreshToken> {
        const [tokenRow]: RefreshToken[] =
            await refreshTokenModel.findByTokenId(tokenId);
        return tokenRow;
    }

    public async revokeByTokenId(
        tokenId: string,
        newTokenId: string
    ): Promise<RefreshToken> {
        try {
            const [tokenRow] = await refreshTokenModel.revokeByTokenId(
                tokenId,
                [true, newTokenId, new Date()]
            );
            return tokenRow;
        } catch (error: unknown) {
            handleServiceError(error, 'Failed to search for token by id');
        }
    }

    public async replace(
        oldTokenId: string,
        newTokenId: string,
        newRawToken: string,
        newExpiresAt: Date
    ): Promise<RefreshToken> {
        try {
            const token: string = await encryptToken(newRawToken);
            const [tokenRow]: RefreshToken[] = await refreshTokenModel.replace(
                oldTokenId,
                newTokenId,
                token,
                newExpiresAt
            );

            return tokenRow;
        } catch (error: unknown) {
            handleServiceError(error, 'Failed to replace refresh token');
        }
    }

    public async revokeAllForUser(userId: string): Promise<RefreshToken> {
        try {
            const [revokeUser] = await refreshTokenModel.revokeAllForUser(
                userId,
                [true, new Date()]
            );
            return revokeUser;
        } catch (error: unknown) {
            handleServiceError(error, 'Failed to remove all user access');
        }
    }

    public async destroy(itemId: string) {
        try {
            await refreshTokenModel.destroy(itemId);
        } catch (error: unknown) {
            handleServiceError(error, 'Failed to remove token');
        }
    }
}
