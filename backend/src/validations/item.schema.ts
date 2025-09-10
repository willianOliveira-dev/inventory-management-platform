import * as z from 'zod';
import emptyErrorMap from '@validations/error/emptyErrorMap';

const ItemSchema = z.object({
    name: z
        .string({ error: emptyErrorMap })
        .nonempty({ error: 'Name cannot be left blank.' })
        .min(3, { error: 'Item name must be at least 3 characters long.' })
        .max(120, {
            error: 'The item name must be a maximum of 120 characters.',
        })
        .transform((str) => str.trim()),
    category_id: z.uuid(),
    description: z
        .string({ error: emptyErrorMap })
        .nonempty({ error: 'Description cannot be left blank.' })
        .min(50, { error: 'Description must be at least 50 characters long.' })
        .max(500, {
            error: 'The Description must be a maximum of 500 characters.',
        })
        .transform((str) => str.trim()),
    price_cents: z
        .number({ error: emptyErrorMap })
        .int({
            error: 'Only whole values are allowed. Example: R$ 1.00 = 100 cents.',
        })
        .positive({ error: 'The value must be positive.' })
        .min(100, { error: 'The minimum value is R$ 1.00 (100 cents).' }),
    current_quantity: z
        .number()
        .int({ error: 'The value must be an integer.' })
        .positive({ error: 'The value must be positive.' })
        .min(0, {
            error: 'It is not allowed to have a negative balance in stock.',
        }),
});
const ItemUpdateSchema = ItemSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: 'At least one field must be provided for update',
        path: ['body'],
    }
);

export { ItemSchema, ItemUpdateSchema };
