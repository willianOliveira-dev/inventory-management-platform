export default class AppError extends Error {
    constructor(
        public readonly status: string = 'error',
        public readonly code: string = 'INTERNAL_ERROR',
        public readonly statusCode: number = 500,
        public readonly message: string,
    ) {
        super(message);
    }
}
