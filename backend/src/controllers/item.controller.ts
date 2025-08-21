import ItemService from '@services/item.service';
import { ItemSchema, ItemUpdateSchema } from '@validations/item.schema';
import type { Request, Response } from 'express';
import { Item, ValidateRequest } from 'types';

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
        return res.status(200).send(items);
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
        return res.status(200).send(item);
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
        const item: Item = await itemService.createItem(req.body);
        return res.status(201).send(item);
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
        return res.status(200).send(item);
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
        await itemService.deleteItem(id);
        return res.status(204).send();
    }
}
