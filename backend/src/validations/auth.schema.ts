import * as z from 'zod';
import emptyErrorMap from './error/emptyErrorMap';

const AuthSchema = z.object({
    email: z.email(),
    password: z.string({ error: emptyErrorMap }),
});

export default AuthSchema;
