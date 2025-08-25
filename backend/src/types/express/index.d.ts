import type { Payload } from "types/auth/Payload";

declare global {
    namespace Express {
        interface Request {
            user?: Payload;
        }
    }
}
