import z from 'zod';
import ItemModel from '@models/ItemModel';
import CategoryModel from '@models/CategoryModel';
import toCapitalize from '@utils/toCapitalize';
import extractObjectValues from '@utils/extractObjectValues';
import updateData from '@utils/updateData';
import StockHistoryModel from '@models/StockHistoryModel';
import handleServiceError from '@utils/handleServiceError';
import NotFoundError from '@errors/http/NotFoundError';
import { v4 as uuidv4 } from 'uuid';
import { ItemSchema, ItemUpdateSchema } from '@validations/item.schema';
import { Item, ItemBase, StockHistory } from 'types';
import ForbiddenError from '@errors/http/ForbiddenError';
import { ItemResponseCode } from 'constants/responsesCode/item';
import UserService from './user.service';

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
    private static async registerStockHistory(
        data: Omit<StockHistory, 'history_id'>
    ) {
        /**
         * Registers a new stock history entry in the 'stock_history' table.
         *
         * This method is used to log inventory changes such as price updates or quantity adjustments.
         * It omits the `history_id`, which is generated internally no momento da criação.
         *
         * @param data - An object containing stock movement details, excluding `history_id`.
         * @returns A Promise that resolves when the stock history is successfully recorded.
         * @throws Error if the insertion fails or an unexpected issue occurs.
         */

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
            handleServiceError(error, 'Falha ao registrar o histórico de estoque.');
        }
    }

    private static async registerItem(
        reqBody: z.infer<typeof ItemSchema>,
        userId: string
    ) {
        /**
         * Prepares and validates item data before creation.
         * Ensures the category exists and formats the item name.
         *
         * @param reqBody - The request body containing item data.
         * @returns A Promise that resolves to a valid item object ready for insertion.
         * @throws NotFoundError if the category does not exist.
         */
        const item_id: string = uuidv4();
        const user_id: string = userId;
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
                `A categoria com o ID "${category_id}" não existe.`
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
            handleServiceError(error, 'Falha ao buscar todos os itens.');
        }
    }

    public async getItemById(itemId: string): Promise<Item> {
        /**
         * Retrieves a single item by its unique ID.
         * Queries the database and returns the first matching item record.
         * Throws a `NotFoundError` if no item is found.
         *
         * @param itemId - The ID of the item to retrieve.
         * @returns A Promise that resolves to the `Item` object.
         * @throws NotFoundError if no item is found with the given ID.
         * @throws Error if the query fails or an unexpected issue occurs.
         */

        try {
            const item: Item[] = await itemModel.getItemById(itemId);

            if (item.length === 0) {
                throw new NotFoundError(
                    'Nenhum registro correspondente ao item foi encontrado.',
                    ItemResponseCode.ITEM_NOT_FOUND
                );
            }

            return item[0];
        } catch (error: unknown) {
            handleServiceError(error, 'Falha ao buscar item pelo ID.');
        }
    }

    public async getItemsByUserId(userId: string): Promise<Item[]> {
        /**
         * Retrieves all items associated with a specific user ID.
         * First verifies the existence of the user, then fetches their items.
         *
         * @param userId - The ID of the user whose items are to be retrieved.
         * @returns A Promise that resolves to an array of `Item` objects.
         * @throws NotFoundError if the user does not exist.
         * @throws Error if the item query fails or another unexpected issue occurs.
         */

        try {
            const { user_id } = await new UserService().getUserById(userId);
            const items: Item[] = await itemModel.getItemByUserId(user_id);
            return items;
        } catch (error) {
            handleServiceError(error, 'Falha ao buscar item pelo user_id.');
        }
    }

    public async createItem(
        reqBody: z.infer<typeof ItemSchema>,
        userId: string
    ): Promise<Item> {
        /**
         * Creates a new item and registers its initial stock history.
         *
         * This method performs the following steps:
         * 1. Validates and formats the input using `ItemService.registerItem`.
         * 2. Persists the item in the database via `itemModel.createItem`.
         * 3. Creates a stock history record with initial quantity and price.
         *
         * @param reqBody - Validated item data from the request body.
         * @param userId - ID of the user creating the item.
         * @returns The newly created `Item` object.
         * @throws ValidationError if the category is invalid.
         * @throws Error if item creation or stock history registration fails.
         */

        try {
            const itemData = await ItemService.registerItem(reqBody, userId);
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
            handleServiceError(error, 'Falha ao criar o item.');
        }
    }

    public async updateItem(
        reqBody: z.infer<typeof ItemUpdateSchema>,
        itemId: string
    ): Promise<Item> {
        /**
         * Updates an existing item in the database with new values.
         *
         * This method retrieves the current item data, applies updates from the request body,
         * formats the name (if provided), and persists the changes. If the item's price or quantity
         * has changed, it also registers a stock history entry to track the modification.
         *
         * @param reqBody - The validated data used to update the item, based on `ItemUpdateSchema`.
         * @param itemId - The unique identifier of the item to be updated.
         * @returns A Promise that resolves to the updated `Item` object.
         * @throws Error if the item cannot be retrieved or updated.
         */

        try {
            const oldItemData = await this.getItemById(itemId);

            const updated_at: Date = new Date();

            const newData: ItemBase = updateData<ItemBase>(
                oldItemData,
                reqBody
            );

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

            if (
                updatedItem.price_cents !== oldItemData.price_cents ||
                updatedItem.current_quantity !== oldItemData.current_quantity
            ) {
                const stockHistoryPayload: Omit<StockHistory, 'history_id'> = {
                    item_id: itemId,
                    user_id: updatedItem.user_id,
                    old_price_cents: oldItemData.price_cents,
                    new_price_cents: updatedItem.price_cents,
                    old_quantity: oldItemData.current_quantity,
                    new_quantity: updatedItem.current_quantity,
                    operation: 'UPDATE',
                    created_at: new Date(),
                };

                await ItemService.registerStockHistory(stockHistoryPayload);
            }

            return updatedItem;
        } catch (error: unknown) {
            handleServiceError(error, 'Falha ao atualizar o item.');
        }
    }

    public async deleteItem(itemId: string, userId: string): Promise<void> {
        /**
         * Deletes an item by its unique identifier.
         * Validates ownership before proceeding with deletion.
         * Handles errors gracefully and logs failure context.
         *
         * @param itemId - The unique ID of the item to be deleted.
         * @param userId - The ID of the user attempting the deletion.
         * @returns A Promise that resolves when the item is successfully deleted.
         * @throws ForbiddenError if the user does not own the item.
         * @throws handleServiceError if the deletion process fails.
         */

        try {
            const item: Item = await this.getItemById(itemId);

            if (item.user_id !== userId) {
                throw new ForbiddenError(
                    "Você não tem permissão para excluir este item.",
                    ItemResponseCode.ITEM_FORBIDDEN
                );
            }

            await itemModel.deleteItem(itemId);
        } catch (error: unknown) {
            handleServiceError(error, 'Falha ao excluir o item pelo ID.');
        }
    }
}
