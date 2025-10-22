import { UserLogin } from 'types/entities/UserTypes';

export type Payload = UserLogin;

declare module 'express' {
    interface Request {
        user?: Payload; // Agora usa o tipo localmente declarado
    }
}
