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
            'Categorias recuperadas com sucesso.',
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
            `Categoria com ID ${id} recuperada com sucesso.`,
            category
        );

        return res.status(200).send(response);
    }

    public async createCategory(
        /**
         * Handles HTTP POST request to create a new category.
         * Accepts validated input based on `CategorySchema` and associates the category with the authenticated user.
         *
         * @param req - Express Request object containing the validated category data in `body` and authenticated user in `req.user`.
         * @param res - Express Response object used to return the result.
         * @returns HTTP 201 with a standardized success response containing the newly created Category object.
         * @throws ValidationError if the input data is invalid.
         * @throws Error if the creation process fails.
         */

        req: ValidateRequest<typeof CategorySchema>,
        res: Response
    ) {
        const { user } = req;
        const { name } = req.body;

        const category: Category = await categoryService.createCategory(
            { name },
            user?.user_id!
        );

        const response = createResponse<Category>(
            'success',
            CategoryResponseCode.CATEGORY_CREATED,
            201,
            'Categoria criada com sucesso.',
            category
        );

        return res.status(201).send(response);
    }

    public async getCategoriesByUser(req: Request, res: Response) {
        /**
         * Handles GET request to retrieve all categories associated with the authenticated user.
         *
         * @param req - Express Request object containing the authenticated user.
         * @param res - Express Response object.
         * @returns HTTP 200 with an array of Category objects belonging to the user.
         */

        const { user } = req;
        const categories: Category[] =
            await categoryService.getCategoriesByUserId(user?.user_id!);
        const response = createResponse(
            'success',
            CategoryResponseCode.CATEGORY_FETCH_SUCCESS,
            200,
            `Categorias recuperadas com sucesso para o user_id: ${user?.user_id}`,
            categories
        );
        res.status(200).send(response);
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
            `Categoria com ID ${id} atualizada com sucesso.`,
            category
        );

        return res.status(200).send(response);
    }

    public async deleteCategory(req: Request, res: Response) {
        /**
         * Handles HTTP DELETE request to remove a category by its unique ID.
         * Validates user ownership before deletion and returns a standardized response.
         *
         * @param req - Express Request object containing the category ID in `params` and authenticated user in `req.user`.
         * @param res - Express Response object used to send the result.
         * @returns HTTP 200 with a success message if deletion is successful.
         * @throws ForbiddenError if the user does not own the category.
         * @throws Error if the deletion process fails.
         */

        const { user } = req;
        const { id } = req.params;

        await categoryService.deleteCategory(id, user?.user_id!);

        const response = createResponse<Category>(
            'success',
            CategoryResponseCode.CATEGORY_DELETED,
            200,
            `Categoria com ID ${id} excluída com sucesso.`
        );

        return res.status(200).send(response);
    }
}
