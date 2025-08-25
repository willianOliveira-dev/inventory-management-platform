import AppError from '@errors/AppError';

export default class ValidationError extends AppError {
    constructor(
        public message: string,
        public code: string = 'VALIDATION_ERROR'
    ) {
        super('error', code, 422, message);
    }
}
