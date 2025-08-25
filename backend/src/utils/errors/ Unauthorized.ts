export default class Unauthorized extends Error {
    private _status: number = 401;

    constructor(public message: string) {
        super(message);
        this.name = 'AUTHENTICATION_FAILED';
        Error.captureStackTrace(this, this.constructor);
    }

    get status() {
        return this._status;
    }

    set status(status: number) {
        if (status !== 401) {
            throw new Error('Unable to change 401 status.');
        }
    }
}
