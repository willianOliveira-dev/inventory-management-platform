import BaseModel from '@models/BaseModel';
import { User } from 'types';

const baseModel = new BaseModel();

/**
 * UserModel provides CRUD operations for the 'users' table using BaseModel.
 */
export default class UserModel {
    public async hasRecord(column: string, value: string): Promise<boolean> {
        /**
         * Asynchronously checks if a record exists in the 'users' table for a given column and value.
         * @param column - The column to search in.
         * @param value - The value to match.
         * @returns A Promise that resolves to true if a matching record exists, or false otherwise.
         */
        return await baseModel.hasRecord('users', column, value);
    }

    public async getAllUsers(): Promise<User[]> {
        /**
         * Asynchronously retrieves all users from the 'users' table.
         * @returns A Promise that resolves to an array of User objects.
         */
        return await baseModel.getAll<User>('users', [
            'user_id',
            'name',
            'email',
            'created_at',
            'updated_at',
        ]);
    }

    public async getUserById(userId: string): Promise<User[]> {
        /**
         * Asynchronously retrieves a user by their ID from the 'users' table.
         * @param userId The ID of the user to retrieve.
         * @returns A Promise that resolves to an array containing the matching User.
         */
        return await baseModel.getById<User>(
            'users',
            ['user_id', 'name', 'email', 'created_at', 'updated_at'],
            userId
        );
    }

    public async getUserByEmail(email: string): Promise<User[]> {
        /**
         * Retrieves user(s) from the database by matching the email address.
         *
         * @param email - The email address to search for.
         * @returns A Promise resolving to an array of User objects with matching email.
         */

        return await baseModel.getByField<User, string>(
            'users',
            ['user_id', 'email', 'password'],
            'email',
            email
        );
    }

    public async getUserWithPassword(userId: string): Promise<User[]> {
        /**
         * Asynchronously retrieves a user by ID, including their password.
         * @param userId The ID of the user to retrieve.
         * @returns A Promise that resolves to an array containing the matching User with password.
         */
        return await baseModel.getById<User>(
            'users',
            [
                'user_id',
                'name',
                'email',
                'password',
                'created_at',
                'updated_at',
            ],
            userId
        );
    }

    public async createUser<V>(userValuesArray: V[]): Promise<User[]> {
        /**
         * Asynchronously creates a new user in the 'users' table.
         * @typeParam V The type of the values being inserted.
         * @param userValuesArray An array of values corresponding to the user fields.
         * @returns A Promise that resolves to an array of the newly created User(s).
         */
        return await baseModel.create<User, V>(
            'users',
            [
                'user_id',
                'name',
                'email',
                'password',
                'created_at',
                'updated_at',
            ],
            userValuesArray
        );
    }

    public async updateUser<V>(
        userId: string,
        userValuesArray: V[]
    ): Promise<User[]> {
        /**
         * Asynchronously updates an existing user in the 'users' table.
         * @typeParam V The type of the values being updated.
         * @param userId The ID of the user to update.
         * @param userValuesArray An array of new values for the user fields.
         * @returns A Promise that resolves to an array of the updated User(s).
         */
        return await baseModel.update<User, V>(
            'users',
            ['name', 'email', 'password', 'updated_at'],
            userValuesArray,
            userId
        );
    }

    public async deleteUser(userId: string): Promise<void> {
        /**
         * Asynchronously deletes a user from the 'users' table by their ID.
         * @param userId The ID of the user to delete.
         * @returns A promise with no value when the item is successfully deleted.
         */
        await baseModel.delete<User>('users', userId);
    }
}
