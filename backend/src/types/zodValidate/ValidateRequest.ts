import * as z from 'zod';
import { type Request } from 'express';

export type ValidateRequest<T extends z.ZodType> = Request<
    { id: string },
    {},
    z.infer<T>
>;
