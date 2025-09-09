import type { User } from '../entities/user';

export interface AuthResponse {
    status: 'success' | 'error';
    code: string;
    statusCode: number;
    message: string;
    data: {
        user: User;
        accessToken: string;
    };
}
