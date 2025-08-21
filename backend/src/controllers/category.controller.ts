import CategoryService from '@services/category.service';
import CategorySchema from '@validations/category.schema';
import type { Request, Response } from 'express';
import { Category, ValidateRequest } from 'types';

const categoryService = new CategoryService();
/**
 * Controller class responsible for handling HTTP requests related to categories.
 * Delegates business logic to CategoryService and formats HTTP responses.
 */

export default class CategoryController {
    public async getAllCategories(_: Request, res: Response) {
        /**
         * Handles GET request to retrieve all categories.
         *
         * @param _ - Express Request object (not used).
         * @param res - Express Response object.
         * @returns HTTP 200 with an array of Category objects.
         */
        const categories: Category[] = await categoryService.getAllCategories();
        return res.status(200).send(categories);
    }

    public async getCategoryById(req: Request, res: Response) {
        /**
         * Handles GET request to retrieve a category by its ID.
         *
         * @param req - Express Request object containing category ID in params.
         * @param res - Express Response object.
         * @returns HTTP 200 with the requested Category object.
         */
        const { id } = req.params;
        const category: Category = await categoryService.getCategoryById(id);
        return res.status(200).send(category);
    }

    public async createCategory(
        /**
         * Handles POST request to create a new category.
         *
         * @param req - Express Request object with validated body (CategorySchema).
         * @param res - Express Response object.
         * @returns HTTP 201 with the newly created Category object.
         */
        req: ValidateRequest<typeof CategorySchema>,
        res: Response
    ) {
        const category: Category = await categoryService.createCategory(
            req.body
        );
        return res.status(201).send(category);
    }

    public async updateCategory(
        req: ValidateRequest<typeof CategorySchema>,
        res: Response
    ) {
        /**
         * Handles PUT/PATCH request to update an existing category.
         *
         * @param req - Express Request object with validated body and category ID in params.
         * @param res - Express Response object.
         * @returns HTTP 200 with the updated Category object.
         */
        const { id } = req.params;
        const category: Category = await categoryService.updateCategory(
            req.body,
            id
        );
        return res.status(200).send(category);
    }

    public async deleteCategory(req: Request, res: Response) {
        /**
         * Handles DELETE request to remove a category by its ID.
         *
         * @param req - Express Request object containing category ID in params.
         * @param res - Express Response object.
         * @returns HTTP 204 with no content.
         */
        const { id } = req.params;
        await categoryService.deleteCategory(id);
        return res.status(204).send();
    }
}
