import { type Payload } from 'types/express/express';

export type PayloadRefresh = Payload & {
    token_id: string;
};
