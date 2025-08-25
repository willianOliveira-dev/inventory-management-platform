import type { ApiResponse, ResponseStatus } from 'types';

export default function createResponse<T>(
    status: ResponseStatus,
    code: string,
    statusCode: number,
    message: string,
    data?: T
): ApiResponse<T> {
    return {
        status,
        code,
        statusCode,
        message,
        ...(data !== undefined && { data }),
    };
}
