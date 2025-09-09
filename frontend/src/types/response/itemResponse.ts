import { type Item } from '../entities/item';

export interface ItemResponse {
    status: 'success' | 'error';
    code: string;
    statusCode: number;
    message: string;
    data: Item;
}
