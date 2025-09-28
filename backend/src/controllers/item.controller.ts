import ItemService from '@services/item.service';
import createResponse from '@utils/createResponse';
import { ItemResponseCode } from 'constants/responsesCode/item';
import { ItemSchema, ItemUpdateSchema } from '@validations/item.schema';
import type { Request, Response } from 'express';
import type { Item, ValidateRequest } from 'types';

const itemService: ItemService = new ItemService();

/**
 * Controller class responsible for handling HTTP requests related to items.
 * Delegates business logic to ItemService and formats HTTP responses.
 */

export default class ItemController {
    public async getAllItems(_: Request, res: Response) {
        /**
         * Handles GET request to retrieve all items.
         *
         * @param _ - Express Request object (not used).
         * @param res - Express Response object.
         * @returns HTTP 200 with an array of Item objects.
         */

        const items: Item[] = await itemService.getAllItems();
        const response = createResponse<Item[]>(
            'success',
            ItemResponseCode.ITEM_FETCH_SUCCESS,
            200,
            'Itens recuperados com sucesso.',
            items
        );

        return res.status(200).send(response);
    }

    public async getItemById(req: Request, res: Response) {
        /**
         * Handles GET request to retrieve a single item by its ID.
         *
         * @param req - Express Request object containing item ID in params.
         * @param res - Express Response object.
         * @returns HTTP 200 with the requested Item object.
         */
        const { id } = req.params;
        const item: Item = await itemService.getItemById(id);
        const response = createResponse<Item>(
            'success',
            ItemResponseCode.ITEM_FETCH_SUCCESS,
            200,
            `Item com ID ${id} recuperado com sucesso.`,
            item
        );

        return res.status(200).send(response);
    }

    public async getItemsByUserId(req: Request, res: Response) {
        /**
         * Handles GET request to retrieve all items associated with the authenticated user.
         *
         * @param req - Express Request object containing the authenticated user.
         * @param res - Express Response object.
         * @returns HTTP 200 with an array of Item objects belonging to the user.
         */
        const { user } = req;
        const items: Item[] = await itemService.getItemsByUserId(
            user?.user_id!
        );
        const response = createResponse(
            'success',
            ItemResponseCode.ITEM_FETCH_SUCCESS,
            200,
            `Itens recuperados com sucesso para o usuário com ID: ${user?.user_id}`,
            items
        );
        res.status(200).send(response);
    }

    public async createItem(
        req: ValidateRequest<typeof ItemSchema>,
        res: Response
    ) {
        /**
         * Handles POST request to create a new item.
         *
         * @param req - Express Request object with validated body (ItemSchema).
         * @param res - Express Response object.
         * @returns HTTP 201 with the newly created Item object.
         */
        const { user } = req;
        const item: Item = await itemService.createItem(
            req.body,
            user?.user_id!
        );
        const response = createResponse<Item>(
            'success',
            ItemResponseCode.ITEM_CREATED,
            201,
            'Item criado com sucesso.',
            item
        );

        return res.status(201).send(response);
    }

    public async updateItem(
        req: ValidateRequest<typeof ItemUpdateSchema>,
        res: Response
    ) {
        /**
         * Handles PUT/PATCH request to update an existing item.
         *
         * @param req - Express Request object with validated body (ItemUpdateSchema) and item ID in params.
         * @param res - Express Response object.
         * @returns HTTP 200 with the updated Item object.
         */
        const { id } = req.params;
        const item: Item = await itemService.updateItem(req.body, id);

        const response = createResponse<Item>(
            'success',
            ItemResponseCode.ITEM_UPDATED,
            200,
            `Item com ID ${id} atualizado com sucesso.`,
            item
        );

        return res.status(200).send(response);
    }

    public async deleteItem(req: Request, res: Response) {
        /**
         * Handles DELETE request to remove an item by its ID.
         *
         * @param req - Express Request object containing item ID in params.
         * @param res - Express Response object.
         * @returns HTTP 204 with no content.
         */
        const { id } = req.params;
        const { user } = req;

        await itemService.deleteItem(id, user?.user_id!);

        const response = createResponse<Item>(
            'success',
            ItemResponseCode.ITEM_DELETED,
            200,
            `Item com ID ${id} excluído com sucesso.`
        );

        return res.status(200).send(response);
    }
}
