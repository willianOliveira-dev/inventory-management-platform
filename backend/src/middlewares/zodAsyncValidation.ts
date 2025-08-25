import type { Request, Response, NextFunction } from 'express';
import * as z from 'zod';

export default function zodAsyncValidation<T extends z.ZodType>(schema: T) {
    /**
     * Middleware for validating request body using a Zod schema asynchronously.
     * @typeParam T A Zod schema type used for validation.
     * @param schema The Zod schema to validate the request body against.
     * @returns An Express middleware function that validates `req.body`.
     * If validation fails, responds with status 422 and a structured error payload.
     * @example
     * app.post('/users', zodAsyncValidation(userSchema), (req, res) => { ... });
     */
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const validateData = await schema.parseAsync(req.body);
            req.body = validateData;
            next();
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                const simplifiedErrors = error.issues.map((issue) => ({
                    field: issue.path?.join('.'),
                    message: issue.message,
                    code: issue.code,
                }));

                return res.status(422).json({
                    status: 'error',
                    code: 'VALIDATION_FAILED',
                    statusCode: 422,
                    details: simplifiedErrors,
                });
            }
        }
    };
}
