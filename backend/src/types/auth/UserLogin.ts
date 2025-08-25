import type { User } from 'types';

export type UserLogin = Pick<User, 'user_id' | 'email' | 'password'>;
