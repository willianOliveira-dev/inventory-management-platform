import TokenStorage from '../utils/TokenStorage';
import api from './api';
import type { LoginData, RegisterData, AuthResponse } from '../types';

const authApi = {
    async login(data: LoginData): Promise<AuthResponse> {
        const { data: response } = await api.post<AuthResponse>(
            '/auth/login',
            data
        );
        const AccessToken = response.data.accessToken;
        TokenStorage.setToken(AccessToken);
        return response;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const { data: response } = await api.post<AuthResponse>(
            '/auth/register',
            data
        );
        const AccessToken = response.data.accessToken;
        TokenStorage.setToken(AccessToken);
        return response;
    },

    async logout(): Promise<void> {
        await api.post<AuthResponse>('/auth/logout');
        TokenStorage.clearToken();
    },

    async refresh(): Promise<AuthResponse> {
        const { data: response } = await api.post<AuthResponse>(
            '/auth/refresh'
        );
        const newAccessToken = response.data.accessToken;
        TokenStorage.setToken(newAccessToken);
        return response;
    },
};

export default authApi;
