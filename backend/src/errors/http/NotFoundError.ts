import AppError from '@errors/AppError';

export default class NotFoundError extends AppError {
    constructor(public message: string,  public code: string = 'NOT_FOUND') {
        super('error', code, 404, message);
    }
}
