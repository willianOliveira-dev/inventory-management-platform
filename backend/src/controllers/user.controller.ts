import UserService from 'services/user.service';
import type { Request, Response } from 'express';
import { UserSchema, UserUpdateSchema } from '@validations/user.schema';
import type { User, ValidateRequest } from 'types';

const userService = new UserService();

/**
 * Controller class responsible for handling HTTP requests related to users.
 * Delegates business logic to UserService and formats HTTP responses.
 */

export default class UserController {
    public async getAllUsers(_: Request, res: Response) {
        /**
         * Handles GET request to retrieve all users.
         *
         * @param _ - Express Request object (not used).
         * @param res - Express Response object.
         * @returns HTTP 200 with an array of User objects.
         */

        const users: User[] = await userService.getAllUsers();
        return res.status(200).send(users);
    }

    public async getUserById(req: Request, res: Response) {
        /**
         * Handles GET request to retrieve a user by their ID.
         *
         * @param req - Express Request object containing user ID in params.
         * @param res - Express Response object.
         * @returns HTTP 200 with the requested User object.
         */
        const { id } = req.params;
        const user: User = await userService.getUserById(id);
        return res.status(200).send(user);
    }

    public async createUser(
        req: ValidateRequest<typeof UserSchema>,
        res: Response
    ) {
        /**
         * Handles POST request to create a new user.
         *
         * @param req - Express Request object with validated body (UserSchema).
         * @param res - Express Response object.
         * @returns HTTP 201 with the newly created User object.
         */
        const user: User = await userService.createUser(req.body);
        return res.status(201).send(user);
    }

    public async updateUser(
        req: ValidateRequest<typeof UserUpdateSchema>,
        res: Response
    ) {
        /**
         * Handles PUT/PATCH request to update an existing user.
         *
         * @param req - Express Request object with validated body (UserUpdateSchema) and user ID in params.
         * @param res - Express Response object.
         * @returns HTTP 200 with the updated User object.
         */
        const { id } = req.params;
        const user: User = await userService.updateUser(req.body, id);
        return res.status(200).send(user);
    }

    public async deleteUser(req: Request, res: Response) {
        /**
         * Handles DELETE request to remove a user by their ID.
         *
         * @param req - Express Request object containing user ID in params.
         * @param res - Express Response object.
         * @returns HTTP 204 with no content.
         */
        const { id } = req.params;
        await userService.deleteUser(id);
        return res.status(204);
    }
}
