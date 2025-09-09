export interface Item {
    item_id?: string;
    user_id?: string;
    name: string;
    category_id: string;
    description: string;
    price_cents: number;
    current_quantity: number;
    created_at?: Date;
    updated_at?: Date;
}
