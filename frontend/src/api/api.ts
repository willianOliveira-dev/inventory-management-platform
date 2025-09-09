import axios, {
    type AxiosError,
    type AxiosInstance,
    type AxiosRequestConfig,
} from 'axios';
import TokenStorage from '../utils/TokenStorage';

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:5000/panel/v1',
    withCredentials: true,
});

// Automaticamente coloca o token de autenticação em todas as requisições feitas para o servidor

api.interceptors.request.use(
    // interceptar todas as requisições  HTTP para o Servidor
    (config) => {
        // Função que roda antes da requisição
        if (TokenStorage.hasToken()) {
            //
            const token: string | null = TokenStorage.getToken();
            config.headers.Authorization = `Bearer ${token}`; // adiciona no cabeçalho
        }
        return config; // Continuar a requisição
    },
    (error: AxiosError) => {
        return Promise.reject(error); // A função que trata errors do interceptor
    }
);

// interceptando a resposta antes de chegar ao cliente 
api.interceptors.response.use(
    (response) => response, // Se deu tudo certo, apenas devolve a resposta
    async (error: AxiosError) => { // Função de reparo, caso haja error de 403 ou outros
       const originalRequest = error.config;
        if (error.response?.status === 403 && !originalRequest?._retry) {
            originalRequest!._retry = true;
            try {
                const { data } = await api.post('/auth/refresh');
                const newAccessToken = data.data;

                TokenStorage.setToken(newAccessToken);

                originalRequest!.headers.Authorization = `Bearer ${newAccessToken}`;
                
                return api(originalRequest as AxiosRequestConfig);

            } catch(refreshError) {
                TokenStorage.clearToken();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
