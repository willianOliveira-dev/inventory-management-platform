import jwt from 'jsonwebtoken';
import { AuthResponseCode } from 'constants/responsesCode/auth';
import type { Request, Response, NextFunction } from 'express';
import type { Payload } from 'types';
import createResponse from '@utils/createResponse';

export default function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    /**
     * Middleware that verifies the presence and validity of a JWT access token.
     *
     * Extracts the token from the Authorization header, verifies it using the access secret,
     * and attaches the decoded payload to `req.user`. If the token is missing or invalid,
     * responds with an appropriate error status.
     *
     * @param req - Express request object containing the Authorization header.
     * @param res - Express response object used to send error responses if needed.
     * @param next - Express next function to pass control to the next middleware.
     */

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token && !authHeader?.startsWith('Bearer ')) {
        return res
            .status(401)
            .json(
                createResponse(
                    'error',
                    AuthResponseCode.TOKEN_MISSING,
                    401,
                    'Authorization header malformed or missing'
                )
            );
    }

    try {
        const payload = jwt.verify(
            token as string,
            process.env.JWT_ACCESS_SECRET!
        ) as Payload;
        req.user = payload;
        next();
    } catch (error) {
        return res
            .status(403)
            .json(
                createResponse(
                    'error',
                    AuthResponseCode.TOKEN_INVALID,
                    403,
                    'Invalid or expired token'
                )
            );
    }
}
