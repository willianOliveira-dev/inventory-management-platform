export interface Entities {
    readonly users: string;
    readonly categories: string;
    readonly items: string;
    readonly stockHistory: string;
    readonly [table: string]: string;
}

export type TableName = 'users' | 'categories' | 'items' | 'stock_history';
