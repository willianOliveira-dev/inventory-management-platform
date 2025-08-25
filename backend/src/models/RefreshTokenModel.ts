import BaseModel from '@models/BaseModel';
import type { RefreshToken } from 'types';

/**
 * RefreshTokenModel provides CRUD operations for the 'refresh_tokens' table using BaseModel.
 */
const baseModel: BaseModel = new BaseModel();

export default class RefreshTokenModel {
    public async save<V>(tokenValuesArray: V[]): Promise<RefreshToken[]> {
        /**
         * Persists one or more refresh token records in the database.
         *
         * @param tokenValuesArray - Array of values matching the refresh_tokens schema.
         * @returns Array of created RefreshToken records.
         */

        return baseModel.create<RefreshToken, V>(
            'refresh_tokens',
            [
                'token_id',
                'user_id',
                'token',
                'revoked',
                'replaced_by',
                'created_at',
                'expires_at',
                'revoked_at',
            ],
            tokenValuesArray
        );
    }

    public async findByTokenId(tokenId: string): Promise<RefreshToken[]> {
        /**
         * Retrieves refresh token records by token ID.
         *
         * @param tokenId - Unique identifier of the token.
         * @returns Array of matching RefreshToken records.
         */

        return baseModel.getById<RefreshToken>(
            'refresh_tokens',
            [
                'token_id',
                'user_id',
                'token',
                'revoked',
                'replaced_by',
                'created_at',
                'expires_at',
                'revoked_at',
            ],
            tokenId
        );
    }

    public async revokeByTokenId<V>(
        tokenId: string,
        tokenValuesArray: V[]
    ): Promise<RefreshToken[]> {
        /**
         * Revokes a refresh token by updating its status fields.
         *
         * @param tokenId - ID of the token to revoke.
         * @param tokenValuesArray - Values for revoked, replaced_by, and revoked_at fields.
         * @returns Array of updated RefreshToken records.
         */

        return baseModel.update<RefreshToken, V>(
            'refresh_tokens',
            ['revoked', 'replaced_by', 'revoked_at'],
            tokenValuesArray,
            tokenId
        );
    }

    private async getUserIdByTokenId(tokenId: string): Promise<string> {
        /**
         * Retrieves the user ID associated with a given token ID.
         *
         * @param tokenId - Token identifier.
         * @returns The user_id linked to the token.
         */

        const [row] = await this.findByTokenId(tokenId);
        return row.user_id;
    }

    public async replace(
        oldTokenId: string,
        newTokenId: string,
        newRawToken: string,
        newExpiresAt: Date
    ): Promise<RefreshToken[]> {
        /**
         * Replaces an old refresh token with a new one.
         * Revokes the old token and creates a new record.
         *
         * @param oldTokenId - ID of the token to be replaced.
         * @param newTokenId - ID of the new token.
         * @param newRawToken - Raw value of the new token.
         * @param newExpiresAt - Expiration date of the new token.
         * @returns Array containing the newly created RefreshToken record.
         */

        // Mark the old one as revoked and create a new record
        this.revokeByTokenId(oldTokenId, [true, newTokenId, new Date()]);

        return this.save([
            newTokenId,
            await this.getUserIdByTokenId(oldTokenId),
            newRawToken,
            false,
            null,
            new Date(),
            newExpiresAt,
            null,
        ]);
    }

    public revokeAllForUser<V>(userId: string, tokenValuesArray: V[]) {
        /**
         * Revokes all refresh tokens associated with a specific user.
         *
         * @param userId - ID of the user whose tokens will be revoked.
         * @param tokenValuesArray - Values for revoked and revoked_at fields.
         * @returns Array of updated RefreshToken records.
         */

        return baseModel.update<RefreshToken, V>(
            'refresh_tokens',
            ['revoked', 'revoked_at'],
            tokenValuesArray,
            userId
        );
    }

    public async destroy(tokenId: string): Promise<void> {
        /**
         * Deletes a refresh token record from the database.
         *
         * @param tokenId - ID of the token to delete.
         * @returns A promise with no value when the item is successfully deleted.
         */

        await baseModel.delete<RefreshToken>('refresh_tokens', tokenId);
    }
}
