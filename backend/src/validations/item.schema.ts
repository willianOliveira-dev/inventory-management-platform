import * as z from 'zod';
import emptyErrorMap from '@validations/error/emptyErrorMap';

const ItemSchema = z.object({
    name: z
        .string({ error: emptyErrorMap })
        .nonempty({ error: 'O nome não pode ficar em branco.' })
        .min(3, { error: 'O nome do item deve ter no mínimo 3 caracteres.' })
        .max(120, {
            error: 'O nome do item deve ter no máximo 120 caracteres.',
        })
        .transform((str) => str.trim()),

    category_id: z.uuid({
        error: 'O ID da categoria deve ser um UUID válido.',
    }),

    description: z
        .string({ error: emptyErrorMap })
        .nonempty({ error: 'A descrição não pode ficar em branco.' })
        .min(50, { error: 'A descrição deve ter no mínimo 50 caracteres.' })
        .max(500, { error: 'A descrição deve ter no máximo 500 caracteres.' })
        .transform((str) => str.trim()),

    price_cents: z
        .number({ error: 'O valor deve ser um número.' })
        .int({
            error: 'Somente valores inteiros são permitidos. Exemplo: R$ 1,00 = 100 centavos.',
        })
        .positive({ error: 'O valor deve ser positivo.' })
        .min(100, { error: 'O valor mínimo é R$ 1,00 (100 centavos).' }),

    current_quantity: z
        .number({ error: 'A quantidade deve ser um número.' })
        .int({ error: 'A quantidade deve ser um número inteiro.' })
        .positive({ error: 'A quantidade deve ser positiva.' })
        .min(0, { error: 'Não é permitido ter saldo negativo em estoque.' }),
});

const ItemUpdateSchema = ItemSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: 'Pelo menos um campo deve ser fornecido para atualização.',
        path: ['body'],
    }
);

export { ItemSchema, ItemUpdateSchema };
