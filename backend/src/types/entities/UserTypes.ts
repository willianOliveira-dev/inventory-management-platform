import { type RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
    user_id: string;
    name: string;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
}

export type UserColumnsArray =
    | 'user_id'
    | 'name'
    | 'email'
    | 'password'
    | 'created_at'
    | 'updated_at';
