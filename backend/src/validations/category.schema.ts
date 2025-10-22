import * as z from 'zod';

const CategorySchema = z.object({
    name: z
        .string({ error: 'O nome deve ser um texto.' })
        .nonempty({ error: 'O nome não pode ficar em branco.' })
        .min(3, {
            error: 'O nome da categoria deve ter no mínimo 3 caracteres.',
        })
        .max(120, {
            error: 'O nome da categoria deve ter no máximo 120 caracteres.',
        })
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9 ]+$/, {
            message: 'Apenas letras, números e espaços são permitidos.',
        })
        .transform((str) => str.trim()),
});

export default CategorySchema;
