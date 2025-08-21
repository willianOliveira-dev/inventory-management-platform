import type { RowDataPacket } from 'mysql2';

export interface CategoryBase {
    category_id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export type Category = CategoryBase & RowDataPacket;
