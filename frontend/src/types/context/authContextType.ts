import type {  RegisterData, LoginData, User } from '../index';

export interface AuthContextType {
    user: User | null;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}
