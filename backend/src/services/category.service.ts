import * as z from 'zod';
import CategoryModel from '@models/CategoryModel';
import extractObjectValues from '@utils/extractObjectValues';
import toCapitalize from '@utils/toCapitalize';
import CategorySchema from '@validations/category.schema';
import updateData from '@utils/updateData';
import { v4 as uuidv4 } from 'uuid';
import { Category, CategoryBase } from 'types';

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
            const errorMessage: string =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            throw new Error(`Failed to fetch all categories: ${errorMessage}`);
        }
    }

    public async getCategoryById(categoryId: string): Promise<Category> {
        /**
         * Asynchronously retrieves a category by its ID.
         * @param categoryId The ID of the category to retrieve.
         * @returns A Promise that resolves to a single Category object.
         * @throws Throws an error if the category is not found or the query fails.
         */
        try {
            const [category]: Category[] = await categoryModel.getCategoryById(
                categoryId
            );
            return category;
        } catch (error: unknown) {
            const errorMessage: string =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            throw new Error(
                `Failed to search for category by id: ${errorMessage}`
            );
        }
    }

    public async createCategory({
        name,
    }: z.infer<typeof CategorySchema>): Promise<Category> {
        /**
         * Asynchronously creates a new category after validating uniqueness and formatting.
         * @param name The name of the category to create.
         * @returns A Promise that resolves to the newly created Category object.
         * @throws Throws an error if the category already exists or creation fails.
         */
        try {
            const category_id: string = uuidv4();
            const created_at: Date = new Date();
            const updated_at: Date = new Date();
            name = toCapitalize(name);

            const exists = await CategoryModel.categoryExistsByName({ name });

            if (exists) {
                throw new Error(
                    `The category "${name}" already exists. The creation has been canceled.`
                );
            }

            const categoryData = {
                category_id,
                name,
                created_at,
                updated_at,
            } as Category;

            const [newCategory]: Category[] =
                await categoryModel.createCategory(
                    extractObjectValues(categoryData, [
                        'category_id',
                        'name',
                        'created_at',
                        'updated_at',
                    ])
                );

            return newCategory;
        } catch (error: unknown) {
            const errorMessage: string =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            throw new Error(`Failed to create category: ${errorMessage}`);
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
    }

    public async deleteCategory(categoryId: string) {
        /**
         * Asynchronously deletes a category by its ID.
         * @param categoryId The ID of the category to delete.
         * @returns A Promise that resolves when the category is successfully deleted.
         * @throws Throws an error if the deletion fails.
         */
        await categoryModel.deleteCategory(categoryId);
    }
}
