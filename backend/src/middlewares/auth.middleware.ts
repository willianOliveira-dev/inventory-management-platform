import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { Payload } from 'types';

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

    if (!token) {
        return res.status(401).json({
            status: 'error',
            code: 'TOKEN_MISSING',
            message: 'Token not provided',
        });
    }
    try {
        const payload = jwt.verify(
            token as string,
            process.env.JWT_ACCESS_SECRET!
        ) as Payload;
        req.user = payload;
        next();
    } catch (error) {
        return res.status(403).json({
            status: 'error',
            code: 'TOKEN_INVALID',
            message: 'Invalid or expired token',
        });
    }
}
