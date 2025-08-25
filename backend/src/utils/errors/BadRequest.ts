export default class BadRequest extends Error {
    private _status: number = 400;
    
    constructor(public message: string) {
        super(message);
        this.name = 'BAD_REQUEST';
        Error.captureStackTrace(this, this.constructor);
    }

    get status() {
        return this._status;
    }

    set status(status: number) {
        if (status !== 400) {
            throw new Error('Unable to change 400 status.');
        }
    }
}
