import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;
        if (error.response?.status === 403 && !originalRequest?._retry) {
            originalRequest!._retry = true;
            try {
                const { data } = await api.post('/auth/refresh');
                const newAccessToken = data.data;

                originalRequest!.headers[
                    'Authorization'
                ] = `Bearer ${newAccessToken}`;

                return api(originalRequest as AxiosRequestConfig);

            } catch {
                console.log('Sessão expirada, faça login novamente');
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
