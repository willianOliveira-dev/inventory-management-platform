import type { RowDataPacket } from 'mysql2';

export interface ItemBase {
    item_id: string;
    user_id: string;
    category_id: string;
    name: string;
    price_cents: number;
    description: string;
    current_quantity: number;
    created_at: Date;
    updated_at: Date;
}

export type Item = ItemBase & RowDataPacket;
