import type { Axios } from 'axios';

// Module Augmentation
declare module 'axios' {
    export interface AxiosRequestConfig<D = any> {
        _retry?: boolean;
    }

    export interface AxiosError<T = unknown, D = any> {
        config: AxiosRequestConfig;
    }
}
