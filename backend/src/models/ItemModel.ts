import BaseModel from '@models/BaseModel';
import { Item } from 'types';

const baseModel: BaseModel = new BaseModel();

/**
 * ItemModel provides CRUD operations for the 'items' table using BaseModel.
 */
export default class ItemModel {
    public async getAllItems(): Promise<Item[]> {
        /**
         * Asynchronously retrieves all items from the 'items' table.
         * @returns A Promise that resolves to an array of Item objects.
         */
        return await baseModel.getAll<Item>('items', [
            'item_id',
            'user_id',
            'category_id',
            'name',
            'price_cents',
            'description',
            'current_quantity',
            'created_at',
            'updated_at',
        ]);
    }

    public async getItemById(itemId: string): Promise<Item[]> {
        /**
         * Asynchronously retrieves an item by its ID from the 'items' table.
         * @param itemId The ID of the item to retrieve.
         * @returns A Promise that resolves to an array containing the matching Item.
         */
        return await baseModel.getById<Item>(
            'items',
            [
                'item_id',
                'user_id',
                'category_id',
                'name',
                'price_cents',
                'description',
                'current_quantity',
                'created_at',
                'updated_at',
            ],
            itemId
        );
    }

    public async getItemByUserId(userId: string): Promise<Item[]> {
        /**
         * Retrieves all items associated with a specific user.
         * Queries the `items` table using the provided `user_id` and returns matching records.
         *
         * @param userId - The ID of the user whose items should be fetched.
         * @returns A Promise that resolves to an array of `Item` objects belonging to the user.
         * @throws Error if the database query fails.
         */
        return await baseModel.getByField<Item, string>(
            'items',
            [
                'item_id',
                'user_id',
                'category_id',
                'name',
                'price_cents',
                'description',
                'current_quantity',
                'created_at',
                'updated_at',
            ],
            'user_id',
            userId
        );
    }

    public async createItem<V>(itemValuesArray: V[]): Promise<Item[]> {
        /**
         * Asynchronously creates a new item in the 'items' table.
         * @typeParam V The type of the values being inserted.
         * @param itemValuesArray An array of values corresponding to the item fields.
         * @returns A Promise that resolves to an array of the newly created Item(s).
         */
        return await baseModel.create<Item, V>(
            'items',
            [
                'item_id',
                'user_id',
                'category_id',
                'name',
                'price_cents',
                'description',
                'current_quantity',
                'created_at',
                'updated_at',
            ],
            itemValuesArray
        );
    }

    public async updateItem<V>(
        itemId: string,
        itemValuesArray: V[]
    ): Promise<Item[]> {
        /**
         * Asynchronously updates an existing item in the 'items' table.
         * @typeParam V The type of the values being updated.
         * @param itemId The ID of the item to update.
         * @param itemValuesArray An array of new values for the item fields.
         * @returns A Promise that resolves to an array of the updated Item(s).
         */
        return await baseModel.update<Item, V>(
            'items',
            [
                'name',
                'category_id',
                'price_cents',
                'description',
                'current_quantity',
                'updated_at',
            ],
            itemValuesArray,
            itemId
        );
    }

    public async deleteItem(itemId: string): Promise<void> {
        /**
         * Asynchronously deletes an item from the 'items' table by its ID.
         * @param itemId The ID of the item to delete.
         * @returns A promise with no value when the item is successfully deleted.
         */
        await baseModel.delete<Item>('items', itemId);
    }
}
