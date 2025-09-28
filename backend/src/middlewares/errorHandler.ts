import AppError from '@errors/AppError';
import createResponse from '@utils/createResponse';
import type { Request, Response, NextFunction } from 'express';

export default function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof AppError) {
        return res
            .status(err.statusCode)
            .json(
                createResponse('error', err.code, err.statusCode, err.message)
            );
    }

    return res
        .status(500)
        .json(
            createResponse(
                'error',
                'INTERNAL_SERVER_ERROR',
                500,
                'Ocorreu um erro inesperado.'
            )
        );
}
