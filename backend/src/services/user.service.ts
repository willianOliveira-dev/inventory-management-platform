import * as z from 'zod';
import UserModel from '@models/UserModel';
import updateData from '@utils/updateData';
import extractObjectValues from '@utils/extractObjectValues';
import toCapitalize from '@utils/toCapitalize';
import encryptPassword from '@utils/encryptPassword';
import { v4 as uuidv4 } from 'uuid';
import { UserSchema, UserUpdateSchema } from '@validations/user.schema';
import { User, UserBase } from 'types';

const userModel: UserModel = new UserModel();

/**
 * Service class responsible for handling business logic related to users.
 * Provides methods to create, retrieve, update, and delete users.
 *
 * Uses the UserModel to interact with the database.
 * Applies validations, formatting, and encryption before persisting data.
 */

export default class UserService {
    public async getAllUsers(): Promise<User[]> {
        /**
         * Retrieves all users from the database.
         *
         * @returns A Promise that resolves to an array of User objects.
         * @throws Error if the retrieval fails.
         */
        try {
            const users: User[] = await userModel.getAllUsers();
            return users;
        } catch (error: unknown) {
            const errorMessage: string =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            throw new Error(`Failed to fetch all users: ${errorMessage}`);
        }
    }

    public async getUserById(userId: string): Promise<User> {
        /**
         * Retrieves a single user by their ID.
         *
         * @param userId - The ID of the user to retrieve.
         * @returns A Promise that resolves to the User object.
         * @throws Error if the user is not found or the query fails.
         */
        try {
            const [user]: User[] = await userModel.getUserById(userId);
            return user;
        } catch (error: unknown) {
            const errorMessage: string =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            throw new Error(`Failed to search for user by id: ${errorMessage}`);
        }
    }

    public async createUser(
        reqbody: z.infer<typeof UserSchema>
    ): Promise<User> {
        /**
         * Creates a new user with formatted name and encrypted password.
         *
         * @param reqbody - The request body containing user data (name, email, password).
         * @returns A Promise that resolves to the newly created User object (without password).
         * @throws Error if the creation fails.
         */
        try {
            let { name, email, password } = reqbody;

            name = toCapitalize(name);

            const user_id: string = uuidv4();
            const created_at: Date = new Date();
            const updated_at: Date = new Date();

            const userData = {
                user_id,
                name,
                email,
                password: await encryptPassword(password),
                created_at,
                updated_at,
            };

            const [newUser]: User[] = await userModel.createUser(
                extractObjectValues(userData, [
                    'user_id',
                    'name',
                    'email',
                    'password',
                    'created_at',
                    'updated_at',
                ])
            );

            const { password: _, constructor, ...safeUser } = newUser;

            return safeUser as User;
        } catch (error: unknown) {
            const errorMessage: string =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            throw new Error(`Failed to create user: ${errorMessage}`);
        }
    }

    public async updateUser(
        reqBody: z.infer<typeof UserUpdateSchema>,
        userId: string
    ): Promise<User> {
        /**
         * Updates an existing user's data.
         * Applies formatting to the name and encrypts the password if provided.
         *
         * @param reqBody - The updated user data.
         * @param userId - The ID of the user to update.
         * @returns A Promise that resolves to the updated User object (without password).
         * @throws Error if the update fails.
         */
        try {
            const [oldUserData] = await userModel.getUserWithPassword(userId);

            const updated_at: Date = new Date();

            const newData: UserBase = updateData<UserBase>(
                oldUserData,
                reqBody
            );

            if (newData.name !== undefined) {
                newData.name = toCapitalize(newData.name);
            }

            if (newData.password !== undefined) {
                newData.password = await encryptPassword(newData.password);
            }

            const updatedUserObject = {
                ...newData,
                updated_at,
            };

            const [updatedUser] = await userModel.updateUser(
                userId,
                extractObjectValues(updatedUserObject, [
                    'name',
                    'email',
                    'password',
                    'updated_at',
                ])
            );

            const { password: _, constructor, ...safeUser } = updatedUser;

            return safeUser as User;
        } catch (error: unknown) {
            const errorMessage: string =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            throw new Error(`Failed to update user: ${errorMessage}`);
        }
    }

    public async deleteUser(userId: string): Promise<void> {
        /**
         * Deletes a user by their ID.
         *
         * @param userId - The ID of the user to delete.
         * @returns A Promise that resolves when the user is successfully deleted.
         * @throws Error if the deletion fails.
         */
        try {
            await userModel.deleteUser(userId);
        } catch (error: unknown) {
            const errorMessage: string =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            throw new Error(`Failed to delete user by id: ${errorMessage}`);
        }
    }
}
