import * as z from 'zod';
import CategoryModel from '@models/CategoryModel';
import extractObjectValues from '@utils/extractObjectValues';
import toCapitalize from '@utils/toCapitalize';
import CategorySchema from '@validations/category.schema';
import handleServiceError from '@utils/handleServiceError';
import NotFoundError from '@errors/http/NotFoundError';
import ForbiddenError from '@errors/http/ForbiddenError';
import UserService from './user.service';
import updateData from '@utils/updateData';
import { v4 as uuidv4 } from 'uuid';
import { Category, CategoryBase } from 'types';
import ValidationError from '@errors/http/ValidationError';
import { CategoryResponseCode } from 'constants/responsesCode/category';

const categoryModel: CategoryModel = new CategoryModel();

/**
 * Service class responsible for handling business logic related to categories.
 * Provides methods to create, retrieve, update, and delete categories.
 *
 * Use the CategoryModel model to interact with the database.
 * Apply validations, formatting, and error handling before delegating the model.
 */
export default class CategoryService {
    public async getAllCategories(): Promise<Category[]> {
        /**
         * Asynchronously retrieves all categories from the database.
         * @returns A Promise that resolves to an array of Category objects.
         * @throws Throws an error if the category retrieval fails.
         */

        try {
            const categories: Category[] =
                await categoryModel.getAllCategories();
            return categories;
        } catch (error: unknown) {
            handleServiceError(error, 'Failed to fetch all categories');
        }
    }

    public async getCategoryById(categoryId: string): Promise<Category> {
        /**
         * Asynchronously retrieves a category by its ID.
         * @param categoryId The ID of the category to retrieve.
         * @returns A Promise that resolves to a single Category object.
         * @throws NotFoundError if no category is found with the given ID.
         * @throws Throws an error if the query fails.
         */

        try {
            const category: Category[] = await categoryModel.getCategoryById(
                categoryId
            );

            if (category.length === 0) {
                throw new NotFoundError(
                    'No records matching the category were found.',
                    CategoryResponseCode.CATEGORY_NOT_FOUND
                );
            }

            return category[0];
        } catch (error: unknown) {
            handleServiceError(error, 'Failed to search for category by id');
        }
    }

    public async getCategoriesByUserId(userId: string): Promise<Category[]> {
        /**
         * Asynchronously retrieves all categories associated with a user ID.
         * @param userId The ID of the user whose categories are to be retrieved.
         * @returns A Promise that resolves to an array of Category objects.
         * @throws NotFoundError if the user does not exist.
         * @throws Throws an error if the query fails.
         */

        try {
            const { user_id } = await new UserService().getUserById(userId);
            const categories: Category[] =
                await categoryModel.getCategoriesByUserId(user_id);
            return categories;
        } catch (error) {
            handleServiceError(error, 'Failed to search for category by user_id');
        }
    }

    public async createCategory(
        { name }: z.infer<typeof CategorySchema>,
        user_id: string
    ): Promise<Category> {
        /**
         * Creates a new category for the specified user after validating uniqueness and formatting.
         * Capitalizes the category name, checks for duplicates, and inserts the new record into the database.
         *
         * @param name - The name of the category to be created (validated via `CategorySchema`).
         * @param user_id - The ID of the user creating the category.
         * @returns A Promise that resolves to the newly created `Category` object.
         * @throws `ValidationError` if a category with the same name already exists.
         * @throws Throws an error if the category is not found or the query fails.
         */

        try {
            const category_id: string = uuidv4();
            const created_at: Date = new Date();
            const updated_at: Date = new Date();
            name = toCapitalize(name);

            const exists = await CategoryModel.categoryExistsByName({
                name,
                user_id,
            });

            if (exists) {
                throw new ValidationError(
                    `The category "${name}" already exists. The creation has been canceled.`,
                    CategoryResponseCode.CATEGORY_ALREADY_EXISTS
                );
            }

            const categoryData = {
                category_id,
                user_id,
                name,
                created_at,
                updated_at,
            } as Category;

            const [newCategory]: Category[] =
                await categoryModel.createCategory(
                    extractObjectValues(categoryData, [
                        'category_id',
                        'user_id',
                        'name',
                        'created_at',
                        'updated_at',
                    ])
                );

            return newCategory;
        } catch (error: unknown) {
            handleServiceError(error, 'Failed to create category');
        }
    }

    public async updateCategory(
        { name }: z.infer<typeof CategorySchema>,
        categoryId: string
    ): Promise<Category> {
        /**
         * Asynchronously updates an existing category by its ID.
         * @param name The new name to update in the category.
         * @param categoryId The ID of the category to update.
         * @returns A Promise that resolves to the updated Category object.
         * @throws Throws an error if the update fails.
         */

        try {
            const oldCategoryData = await this.getCategoryById(categoryId);
            const updated_at: Date = new Date();
            name = toCapitalize(name);

            const newData: CategoryBase = updateData<CategoryBase>(
                oldCategoryData,
                { name }
            );

            const updatedCategoryObject = { ...newData, updated_at };
            const [updatedCategory]: Category[] =
                await categoryModel.updateCategory(
                    categoryId,
                    extractObjectValues(updatedCategoryObject, [
                        'name',
                        'updated_at',
                    ])
                );

            return updatedCategory;
        } catch (error: unknown) {
            handleServiceError(error, 'Failed to update category');
        }
    }

    public async deleteCategory(categoryId: string, user_id: string) {
        /**
         * Asynchronously deletes a category by its ID.
         * @param categoryId The ID of the category to delete.
         * @returns A Promise that resolves when the category is successfully deleted.
         * @throws Throws an error if the deletion fails.
         */
        try {
            const category: Category = await this.getCategoryById(categoryId);

            if (category.user_id !== user_id) {
                throw new ForbiddenError(
                    "You don't have permission to delete this item",
                    CategoryResponseCode.CATEGORY_FORBIDDEN
                );
            }
            await categoryModel.deleteCategory(categoryId);
        } catch (error: unknown) {
            handleServiceError(error, 'Failed to delete category by id');
        }
    }
}
