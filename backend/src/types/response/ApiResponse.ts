import type { ResponseStatus } from './ResponseStatus';

export interface ApiResponse<T> {
    status: ResponseStatus;
    code: string;
    statusCode: number;
    message: string;
    data?: T;
}
