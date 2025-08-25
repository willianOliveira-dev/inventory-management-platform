import type { RowDataPacket } from 'mysql2';

export interface RefreshToken extends RowDataPacket {
    token_id: string; 
    user_id: string; 
    token: string;
    revoked: boolean;
    replaced_by?: string | null;
    created_at: Date;
    expires_at: Date;
    revoked_at?: Date | null;
}
