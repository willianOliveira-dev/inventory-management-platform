import BaseModel from '@models/BaseModel';
import type { RefreshToken } from 'types';

/**
 * TokenModel provides CRUD operations for the 'refresh_tokens' table using BaseModel.
 */
const baseModel: BaseModel = new BaseModel();

export default class RefreshTokenModel {
    public async save<V>(tokenValuesArray: V[]): Promise<RefreshToken[]> {
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
        return baseModel.update<RefreshToken, V>(
            'refresh_tokens',
            ['revoked', 'replaced_by', 'revoked_at'],
            tokenValuesArray,
            tokenId
        );
    }

    private async getUserIdByTokenId(tokenId: string): Promise<string> {
        const [row] = await this.findByTokenId(tokenId);
        return row.user_id;
    }

    public async replace(
        oldTokenId: string,
        newTokenId: string,
        newRawToken: string,
        newExpiresAt: Date
    ): Promise<RefreshToken[]> {
        // Marca o antigo como revogado e cria um novo registro
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
        return baseModel.update<RefreshToken, V>(
            'refresh_tokens',
            ['revoked', 'revoked_at'],
            tokenValuesArray,
            userId
        );
    }

    public async destroy(tokenId: string): Promise<void> {
        await baseModel.delete<RefreshToken>('refresh_tokens', tokenId);
    }
}
