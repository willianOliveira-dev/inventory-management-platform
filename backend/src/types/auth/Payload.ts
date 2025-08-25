import type { UserLogin } from 'types';

export type Payload = Pick<UserLogin, 'user_id' | 'email'>;

