export interface ErrorResponse {
    code: string;
    message: { field: string; message: string; code: string }[];
}
