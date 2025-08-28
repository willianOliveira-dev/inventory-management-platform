import { type LoginData } from '../login/login';

export type RegisterData = LoginData & {
    name: string;
};
