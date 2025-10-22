import * as z from 'zod';

const UserSchema = z.object({
    name: z
        .string({ error: 'O nome deve ser um texto.' })
        .nonempty({ error: 'O nome não pode ficar em branco.' })
        .min(3, { error: 'O nome deve ter no mínimo 3 caracteres.' })
        .max(50, { error: 'O nome deve ter no máximo 50 caracteres.' })
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/, {
            message: 'Apenas letras e espaços são permitidos.',
        })
        .transform((str) => str.trim()),

    email: z.email({ error: 'E-mail inválido.' }),

    password: z
        .string({ error: 'A senha deve ser uma string.' })
        .min(8, { error: 'A senha deve ter no mínimo 8 caracteres.' })
        .max(250, { error: 'A senha pode ter no máximo 250 caracteres.' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
            error: 'A senha deve conter: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial (!@#$%^&*).',
        }),
});

const UserUpdateSchema = UserSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: 'Pelo menos um campo deve ser fornecido para atualização.',
        path: ['body'],
    }
);

export { UserSchema, UserUpdateSchema };
