import type { LoginData, RegisterData, AuthResponse } from '../types';
import TokenStorage from '../utils/TokenStorage';
import api from './api';

const authApi = {
    async login(data: LoginData): Promise<AuthResponse> {
        const { data: response } = await api.post<AuthResponse>('/panel/v1/auth/login', data );
        return response;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const { data: response } = await api.post('/panel/v1/auth/register', data);
        return response;
    },

    async logout(): Promise<void> {
        await api.post('/panel/v1/auth/logout');
        TokenStorage.clearToken();
    },

    async refresh(): Promise<AuthResponse> {
        const {data:response} = await api.post('/panel/v1/auth/refresh');
        return response;
    }
};

export default authApi;
