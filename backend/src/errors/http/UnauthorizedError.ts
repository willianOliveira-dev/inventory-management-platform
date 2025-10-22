import AppError from '@errors/AppError';

export default class UnauthorizedError extends AppError {
    constructor(public message: string, public code: string = 'UNAUTHORIZED') {
        super('error', code, 401, message);
    }
}
