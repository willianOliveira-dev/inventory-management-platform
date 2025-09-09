import api from './api';
import type { ItemResponse, Item } from '../types';

const itemApi = {
    async getAllMyItems(): Promise<Item[]> {
        const { data: response } = await api.get<ItemResponse>(
            '/items/user/my-items'
        );
        return response.data as unknown as Item[];
    },

    async getItemById(itemId: string): Promise<Item> {
        const { data: response } = await api.get<ItemResponse>(
            `/items/${itemId}`
        );
        return response.data;
    },

    async createItem({
        name,
        category_id,
        description,
        price_cents,
        current_quantity,
    }: Item) {
        const newItem: Item = {
            name,
            category_id,
            description,
            price_cents,
            current_quantity,
        };

        const { data: response } = await api.post<ItemResponse>(
            '/items',
            newItem
        );
        return response.data;
    },

    async updateItem(
        { name, category_id, description, price_cents, current_quantity }: Item,
        itemId: string
    ): Promise<Item> {
        const updatedItem: Item = {
            name,
            category_id,
            description,
            price_cents,
            current_quantity,
        };

        const { data: response } = await api.patch<ItemResponse>(
            `/items/${itemId}`,
            updatedItem
        );
        return response.data;
    },

    async deleteItem(itemId: string): Promise<void> {
        await api.delete(`/items/${itemId}`);
        return;
    },
};

export default itemApi;
