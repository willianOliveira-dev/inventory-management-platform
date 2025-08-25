import type { Payload } from "./Payload";

export type PayloadRefresh = Payload & {
    token_id: string;
};
