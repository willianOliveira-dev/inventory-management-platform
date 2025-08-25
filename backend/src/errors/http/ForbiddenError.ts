import AppError from '@errors/AppError';

export default class ForbiddenError extends AppError {
    constructor(public message: string,  public code: string = 'FORBIDDEN') {
        super('error', code, 403, message)
    }
}
