import BaseModel from '@models/BaseModel';
import pool from '@config/connect';
import handleServiceError from '@utils/handleServiceError';
import { RowDataPacket } from 'mysql2';
import { type Category } from 'types';

const baseModel = new BaseModel();

/**
 * CategoryModel provides CRUD operations for the 'categories' table using BaseModel.
 */
export default class CategoryModel {
    public static async categoryExistsByName({
        name,
        user_id,
    }: Pick<Category, 'name' | 'user_id'>): Promise<boolean> {
        /**
         * Checks whether a category with the given name already exists for the specified user.
         * Executes a SQL query to count matching records in the `categories` table.
         *
         * @param name - The name of the category to check.
         * @param user_id - The ID of the user who owns the category.
         * @returns A Promise that resolves to `true` if the category exists, or `false` otherwise.
         * @throws Error if the database query fails.
         */

        try {
            const sql = `SELECT COUNT(*) AS count FROM categories WHERE name = ? AND user_id = ?;`;
            const [resultQuery] = await pool.query<RowDataPacket[]>(sql, [
                name,
                user_id,
            ]);

            const count: number = resultQuery[0].count;

            return count > 0;
        } catch (error: unknown) {
            handleServiceError(
                error,
                'Error checking for duplicate category name'
            );
        }
    }

    public static async categoryExistsById(
        categoryId: string
    ): Promise<boolean> {
        /**
         * Asynchronously checks if a category exists in the 'categories' table by its ID.
         * @param categoryId The ID of the category to check.
         * @returns A Promise that resolves if the category exists.
         * @throws Throws an error if the database query fails.
         */

        try {
            const [resultQuery] = await pool.query<RowDataPacket[]>(
                `SELECT COUNT(*) AS count FROM categories WHERE category_id = ?`,
                [categoryId]
            );
            const count: number = resultQuery[0].count;
            return count > 0;
        } catch (error: unknown) {
            const errorMessage: string =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            throw new Error(
                `Error checking if category ID exists: ${errorMessage}`
            );
        }
    }

    public async getAllCategories(): Promise<Category[]> {
        /**
         * Asynchronously retrieve the list of all registered categories.
         * @returns A Promise that resolves to an array of Category objects.
         */
        return await baseModel.getAll<Category>('categories', [
            'category_id',
            'user_id',
            'name',
            'created_at',
            'updated_at',
        ]);
    }

    public async getCategoryById(categoryId: string): Promise<Category[]> {
        /**
         * Asynchronously retrieves a list of categories from the database using the provided category ID.
         * @param categoryId Represents the primary key of the category table
         * @returns A Promise that resolves to an array of Category objects containing category_id, name, created_at, and updated_at.
         */
        return await baseModel.getById<Category>(
            'categories',
            ['category_id', 'user_id', 'name', 'created_at', 'updated_at'],
            categoryId
        );
    }

    public async getCategoriesByUserId(userId: string): Promise<Category[]> {
        /**
         * Retrieves all categories associated with a specific user.
         * Queries the `categories` table using the provided `user_id` and returns matching records.
         *
         * @param userId - The ID of the user whose items should be fetched.
         * @returns A Promise that resolves to an array of `Category` objects belonging to the user.
         * @throws Error if the database query fails.
         */

        return await baseModel.getByField<Category, string>(
            'categories',
            ['category_id', 'user_id', 'name', 'created_at', 'updated_at'],
            'user_id',
            userId
        );
    }

    public async createCategory<V>(
        categoryValuesArray: V[]
    ): Promise<Category[]> {
        /**
         * Asynchronously creates new category records in the database using the provided values.
         * @param categoryValuesArray An array representing each value of the columns 'category_id', 'name', 'created_at', 'updated_at'
         * @returns A Promise that resolves to an array of Category objects containing category_id, name, created_at, and updated_at.
         */
        return await baseModel.create<Category, V>(
            'categories',
            ['category_id', 'user_id', 'name', 'created_at', 'updated_at'],
            categoryValuesArray
        );
    }

    public async updateCategory<V>(
        categoryId: string,
        categoryValuesArray: V[]
    ): Promise<Category[]> {
        /**
         * Asynchronously updates an existing category in the database using the provided category ID and values.
         * @param categoryId Represents the primary key of the category table
         * @param categoryValuesArray An array containing the value of the "name" column to be updated.
         * @returns A Promise that resolves to an array of updated Category objects containing category_id, name, created_at, and updated_at.
         */
        return await baseModel.update<Category, V>(
            'categories',
            ['name', 'updated_at'],
            categoryValuesArray,
            categoryId
        );
    }

    public async deleteCategory(categoryId: string): Promise<void> {
        /**
         * Asynchronously deletes a category from the database using the provided category ID.
         * @param categoryId Represents the primary key of the category table
         * @returns A Promise that resolves with no value upon successful deletion.
         */
        await baseModel.delete<Category>('categories', categoryId);
    }
}
