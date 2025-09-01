import api from '../api/api';
import authApi from '../api/authApi';
import TokenStorage from '../utils/TokenStorage';
import AuthContext from '../context/authContext';
import { useEffect, useState } from 'react';
import type {
    User,
    LoginData,
    RegisterData,
    AuthContextType,
    AuthProviderProps,
} from '../types';

export default function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const checkAuth = async () => {
        const token: string | null = TokenStorage.getToken();

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const {
                data: { ...user },
            } = await api.get<User>('/panel/v1/auth/me');
            setUser(user);
        } catch (error: unknown) {
            TokenStorage.clearToken();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (data: LoginData): Promise<void> => {
        try {
            const {
                data: { user },
            } = await authApi.login(data);
            setUser(user);
        } catch (error: unknown) {
            TokenStorage.clearToken();
            setUser(null);
            throw error;
        }
    };

    const register = async (data: RegisterData): Promise<void> => {
        try {
            const {
                data: { user },
            } = await authApi.register(data);
            setUser(user);
        } catch (error) {
            TokenStorage.clearToken();
            setUser(null);
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authApi.logout();
        } finally {
            TokenStorage.clearToken();
            setUser(null);
        }
    };

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        isLoading,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
