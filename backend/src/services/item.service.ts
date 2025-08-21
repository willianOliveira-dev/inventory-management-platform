import z from 'zod';
import ItemModel from '@models/ItemModel';
import CategoryModel from '@models/CategoryModel';
import toCapitalize from '@utils/toCapitalize';
import extractObjectValues from '@utils/extractObjectValues';
import updateData from '@utils/updateData';
import StockHistoryModel from '@models/StockHistoryModel';
import NotFoundError from '@utils/errors/NotFoundError';
import { v4 as uuidv4 } from 'uuid';
import { ItemSchema, ItemUpdateSchema } from '@validations/item.schema';
import { Item, ItemBase, StockHistory } from 'types';

const itemModel: ItemModel = new ItemModel();
const stockHistoryModel: StockHistoryModel = new StockHistoryModel();

/**
 * Service class responsible for handling business logic related to items.
 * Provides methods to create, retrieve, update, and delete items.
 *
 * Use the ItemModel model to interact with the database.
 * Uses the StockHistoryModel to create and track changes made by the client.
 * Apply validations, formatting, and error handling before delegating the model.
 */

export default class ItemService {
    // TODO CRIAR DOCUMENTAçÃO
    private static async registerStockHistory(
        data: Omit<StockHistory, 'history_id'>
    ) {
        try {
            const stockMovements = {
                ...data,
            };

            await stockHistoryModel.createStockHistory(
                extractObjectValues(stockMovements, [
                    'item_id',
                    'user_id',
                    'old_price_cents',
                    'new_price_cents',
                    'old_quantity',
                    'new_quantity',
                    'operation',
                    'created_at',
                ])
            );
        } catch (error: unknown) {
            const errorMessage: string =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            throw new Error(
                `Failed to register stock history: ${errorMessage}`
            );
        }
    }

    private static async registerItem(reqBody: z.infer<typeof ItemSchema>) {
        /**
         * Prepares and validates item data before creation.
         * Ensures the category exists and formats the item name.
         *
         * @param reqBody - The request body containing item data.
         * @returns A Promise that resolves to a valid item object ready for insertion.
         * @throws NotFoundError if the category does not exist.
         */
        const item_id: string = uuidv4();
        const user_id: string = '791dd1e7-a29e-462e-8769-b119229e4596'; // ! ALTERAR PARA O REGISTRO DO USUÁRIO LOGADO - Payload
        const created_at: Date = new Date();
        const updated_at: Date = new Date();

        let { name, category_id, price_cents, current_quantity, description } =
            reqBody;

        name = toCapitalize(name);

        const exists: boolean = await CategoryModel.categoryExistsById(
            category_id
        );

        if (!exists) {
            throw new NotFoundError(
                `Category with id "${category_id}" does not exist.`
            );
        }

        const itemData = {
            item_id,
            user_id,
            category_id,
            name,
            price_cents,
            description,
            current_quantity,
            created_at,
            updated_at,
        };

        return itemData;
    }

    public async getAllItems(): Promise<Item[]> {
        /**
         * Retrieves all items from the database.
         *
         * @returns A Promise that resolves to an array of Item objects.
         * @throws Error if the retrieval fails.
         */
        try {
            const items: Item[] = await itemModel.getAllItems();
            return items;
        } catch (error: unknown) {
            const errorMessage: string =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            throw new Error(`Failed to fetch all items: ${errorMessage}`);
        }
    }

    public async getItemById(itemId: string): Promise<Item> {
        /**
         * Retrieves a single item by its ID.
         *
         * @param itemId - The ID of the item to retrieve.
         * @returns A Promise that resolves to the Item object.
         * @throws Error if the item is not found or the query fails.
         */
        try {
            const [item]: Item[] = await itemModel.getItemById(itemId);
            return item;
        } catch (error: unknown) {
            const errorMessage: string =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            throw new Error(`Failed to search for item by id: ${errorMessage}`);
        }
    }

    public async createItem(
        reqBody: z.infer<typeof ItemSchema>
    ): Promise<Item> {
        /**
         * Creates a new item after validating and formatting the input.
         *
         * This method performs the following steps:
         * 1. Validates and registers the item using `ItemService.registerItem`.
         * 2. Persists the item in the database via `itemModel.createItem`.
         * 3. Automatically creates a stock history record with initial values.
         *
         * @param reqBody - The request body containing item data, validated against `ItemSchema`.
         * @returns A Promise that resolves to the newly created `Item` object.
         * @throws Error if the category is invalid, the item creation fails, or any unexpected issue occurs.
         */
        try {
            const itemData = await ItemService.registerItem(reqBody);
            const {
                item_id,
                user_id,
                price_cents,
                current_quantity,
                created_at,
            } = itemData;

            const [newItem] = await itemModel.createItem(
                extractObjectValues(itemData, [
                    'item_id',
                    'user_id',
                    'category_id',
                    'name',
                    'price_cents',
                    'description',
                    'current_quantity',
                    'created_at',
                    'updated_at',
                ])
            );

            const stockHistoryPayload: Omit<StockHistory, 'history_id'> = {
                item_id,
                user_id,
                old_price_cents: 0,
                new_price_cents: price_cents,
                old_quantity: 0,
                new_quantity: current_quantity,
                operation: 'ADD',
                created_at,
            };

            await ItemService.registerStockHistory(stockHistoryPayload);

            return newItem;
        } catch (error: unknown) {
            const errorMessage: string =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            throw new Error(`Failed to create item: ${errorMessage}`);
        }
    }

    public async updateItem(
        reqBody: z.infer<typeof ItemUpdateSchema>,
        itemId: string
    ): Promise<Item> {
        /**
         * Updates an existing item with new data.
         * Applies formatting to the name if provided.
         *
         * @param reqBody - The updated item data.
         * @param itemId - The ID of the item to update.
         * @returns A Promise that resolves to the updated Item object.
         * @throws Error if the update fails.
         */
        const oldItemData = await this.getItemById(itemId);

        const updated_at: Date = new Date();

        const newData: ItemBase = updateData<ItemBase>(oldItemData, reqBody);

        if (newData.name !== undefined) {
            newData.name = toCapitalize(newData.name);
        }

        const updatedItemObject = {
            ...newData,
            updated_at,
        };

        const [updatedItem] = await itemModel.updateItem(
            itemId,
            extractObjectValues(updatedItemObject, [
                'name',
                'category_id',
                'price_cents',
                'description',
                'current_quantity',
                'updated_at',
            ])
        );

        return updatedItem;
    }

    public async deleteItem(itemId: string): Promise<void> {
        /**
         * Deletes an item by its ID.
         *
         * @param itemId - The ID of the item to delete.
         * @returns A Promise that resolves when the item is successfully deleted.
         * @throws Error if the deletion fails.
         */
        try {
            await itemModel.deleteItem(itemId);
        } catch (error: unknown) {
            const errorMessage: string =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            throw new Error(`Failed to delete item by id: ${errorMessage}`);
        }
    }
}
