import * as z from 'zod';
import emptyErrorMap from './error/emptyErrorMap';

const AuthSchema = z.object({
    email: z
        .email({ error: 'E-mail inválido.' })
        .nonempty('E-mail é obrigatório.'),
    password: z
        .string({ error: 'A senha deve ser um texto' })
        .nonempty({ error: 'Senha é obrigatória.' })
        .min(8, { error: 'A senha deve ter no mínimo 8 caracteres.' }),
});

export default AuthSchema;
