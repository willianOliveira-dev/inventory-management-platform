export interface Entities {
    readonly users: string;
    readonly categories: string;
    readonly items: string;
    readonly stock_history: string;
    readonly [table: string]: string;
}

export type TableName = 'users' | 'categories' | 'items' | 'stock_history';
