import CategoryService from '@services/category.service';
import CategorySchema from '@validations/category.schema';
import createResponse from '@utils/createResponse';
import { CategoryResponseCode } from 'constants/responsesCode/category';
import type { Category, ValidateRequest } from 'types';
import type { Request, Response } from 'express';

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

        const response = createResponse<Category[]>(
            'success',
            CategoryResponseCode.CATEGORY_FETCH_SUCCESS,
            200,
            'Categories retrieved successfully',
            categories
        );

        return res.status(200).send(response);
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

        const response = createResponse<Category>(
            'success',
            CategoryResponseCode.CATEGORY_FETCH_SUCCESS,
            200,
            `Successfully fetched category with ID ${id}`,
            category
        );

        return res.status(200).send(response);
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

        const response = createResponse<Category>(
            'success',
            CategoryResponseCode.CATEGORY_CREATED,
            201,
            'Category created successfully',
            category
        );

        return res.status(201).send(response);
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

        const response = createResponse<Category>(
            'success',
            CategoryResponseCode.CATEGORY_UPDATED,
            200,
            `Successfully updated category with ID ${id}`,
            category
        );

        return res.status(200).send(response);
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

        const response = createResponse<Category>(
            'success',
            CategoryResponseCode.CATEGORY_DELETED,
            200,
            `Category with ID ${id} successfully deleted`
        );

        return res.status(200).send(response);
    }
}
