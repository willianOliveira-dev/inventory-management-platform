import * as z from 'zod';
import emptyErrorMap from '@validations/error/emptyErrorMap';

const CategorySchema = z.object({
    name: z
        .string({ error: emptyErrorMap })
        .nonempty({ error: 'Name cannot be left blank.' })
        .min(3, { error: 'Category name must be at least 3 characters long.' })
        .max(120, {
            error: 'The category name must be a maximum of 120 characters.',
        })
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9 ]+$/, 'Only letters, numbers, and spaces.')
        .transform((str) => str.trim()),
});

export default CategorySchema;
