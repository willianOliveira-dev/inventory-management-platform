import AuthService from '@services/auth.service';
import UserService from '@services/user.service';
import createResponse from '@utils/createResponse';
import AuthSchema from '@validations/auth.schema';
import { AuthResponseCode } from 'constants/responsesCode/auth';
import { UserSchema } from '@validations/user.schema';
import type { Request, Response } from 'express';
import type { AuthTokens, User, ValidateRequest } from 'types';

const authService: AuthService = new AuthService();

/**
 * Controller responsible for handling authentication-related HTTP requests.
 * Includes user registration, login, logout, and token refresh operations.
 */

export default class AuthController {
    public async logout(req: Request<{}, {}, AuthTokens>, res: Response) {
        /**
         * Logs out the user by invalidating the refresh token and clearing the cookie.
         *
         * @param req - Express request containing the refresh token in cookies.
         * @param res - Express response used to clear the cookie and return status.
         * @returns HTTP 200 with a success message.
         */

        const refreshTokenRaw: string = req.cookies.refreshToken;

        if (refreshTokenRaw) {
            await authService.logout(refreshTokenRaw);
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });

        const response = createResponse(
            'success',
            AuthResponseCode.USER_LOGGED_OUT,
            200,
            'User logged out successfully'
        );

        return res.status(200).json(response);
    }

    public async register(
        req: ValidateRequest<typeof UserSchema>,
        res: Response
    ) {
        /**
         * Registers a new user and immediately logs them in.
         * Sets a secure HttpOnly refresh token cookie and returns an access token.
         *
         * @param req - Express request containing validated user registration data.
         * @param res - Express response used to set cookies and return user info.
         * @returns HTTP 201 with user data and access token.
         */

        const { name, email, password } = req.body;

        const user: User = await authService.register(name, email, password);

        const { accessToken, refreshToken } = await authService.login(
            email,
            password
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/panel/v1/auth/refresh',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        const data = {
            user: {
                id: user.user_id,
                email: user.email,
            },
            accessToken,
        };

        const response = createResponse(
            'success',
            AuthResponseCode.USER_REGISTERED,
            201,
            'User registered successfully',
            data
        );

        return res.status(201).json(response);
    }

    public async login(req: ValidateRequest<typeof AuthSchema>, res: Response) {
        /**
         * Authenticates a user and returns an access token.
         * Sets a secure HttpOnly refresh token cookie.
         *
         * @param req - Express request containing validated login credentials.
         * @param res - Express response used to set cookies and return user info.
         * @returns HTTP 200 with user data and access token.
         */
        const { email, password } = req.body;

        const { user_id } = await new UserService().getUserByEmail(email);

        const { accessToken, refreshToken } = await authService.login(
            email,
            password
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/panel/v1/auth/refresh',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        const data = {
            user: {
                user_id,
                email,
            },
            accessToken,
        };

        const response = createResponse(
            'success',
            AuthResponseCode.USER_LOGGED_IN,
            200,
            'User logged in successfully',
            data
        );

        return res.json(response);
    }

    public async refresh(req: Request<{}, {}, AuthTokens>, res: Response) {
        /**
         * Refreshes the access token using a valid refresh token.
         * Sets a new secure HttpOnly refresh token cookie.
         *
         * @param req - Express request containing the refresh token in the body.
         * @param res - Express response used to set cookies and return the new access token.
         * @returns HTTP 200 with a new access token.
         */
        const refreshTokenRaw: string = req.cookies.refreshToken;

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await authService.refresh(refreshTokenRaw);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/auth/refresh',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        const response = createResponse(
            'success',
            AuthResponseCode.ACCESS_TOKEN_REFRESHED,
            200,
            'Access token successfully refreshed',
            newAccessToken
        );

        return res.status(200).json(response);
    }
}
