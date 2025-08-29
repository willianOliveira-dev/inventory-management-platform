import type { AuthResponse, RegisterData, LoginData, User } from '../index';

export interface AuthContextType {
    user: User | null;
    login: (data: LoginData) => Promise<AuthResponse>;
    register: (data: RegisterData) => Promise<AuthResponse>;
    logout(): () => Promise<void>;
    isLoading: boolean;
}
