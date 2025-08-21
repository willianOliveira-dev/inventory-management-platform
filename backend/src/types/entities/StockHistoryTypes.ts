import type { RowDataPacket } from 'mysql2';

enum Operation {
    add = 'ADD',
    delete = 'DELETE',
    update = 'UPDATE',
}

export interface StockHistory extends RowDataPacket {
    history_id: string;
    item_id: string;
    user_id: string;
    old_price_cents: number;
    new_price_cents: number;
    old_quantity: number;
    new_quantity: number;
    operation: Operation.add | Operation.delete | Operation.update;
    created_at: Date;
}
