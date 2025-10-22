import { type RowDataPacket } from 'mysql2';

export interface UserBase {
    user_id: string;
    name: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}

export type User = UserBase & RowDataPacket;

export type UserLogin = Pick<UserBase, 'user_id' | 'email'>;
