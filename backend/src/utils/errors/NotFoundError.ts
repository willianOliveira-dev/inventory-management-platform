export default class NotFoundError extends Error {
    constructor(public message: string) {
        super(message);
        this.name = 'NotFoundError';
        Error.captureStackTrace(this, this.constructor);
    }
}
