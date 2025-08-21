import type { RowDataPacket } from 'mysql2';

export interface StockHistory extends RowDataPacket {
    history_id: string;
    item_id: string;
    user_id: string;
    old_price_cents: number;
    new_price_cents: number;
    old_quantity: number;
    new_quantity: number;
    operation: 'ADD' | 'UPDATE'
    created_at: Date;
}
