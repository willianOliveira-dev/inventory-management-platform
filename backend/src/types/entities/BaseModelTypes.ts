export interface Entities {
    readonly users: string;
    readonly items: string;
    readonly categories: string;
    readonly refresh_tokens: string;
    readonly stock_history: string;
    readonly [table: string]: string;
}

export type TableName =
    | 'users'
    | 'items'
    | 'categories'
    | 'refresh_tokens'
    | 'stock_history';
