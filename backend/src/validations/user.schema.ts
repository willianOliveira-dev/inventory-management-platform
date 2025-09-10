import * as z from 'zod';
import emptyErrorMap from '@validations/error/emptyErrorMap';

const UserSchema = z.object({
    name: z
        .string({ error: emptyErrorMap })
        .nonempty({ error: 'Name cannot be left blank.' })
        .min(3, { error: 'The name must be at least 3 characters long.' })
        .max(50, { error: 'The name must have a maximum of 50 characters.' })
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/, 'Only letters and spaces.')
        .transform((str) => str.trim()),
    email: z.email({ error: 'Invalid email format.' }),
    password: z
        .string({ error: emptyErrorMap })
        .min(8, { error: 'Password must be at least 8 characters long.' })
        .max(250, {
            error: 'The password can have a maximum of 250 characters',
        })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
            error: 'The password must contain: 1 uppercase, 1 lowercase, 1 number, and 1 special character (!@#$%^&*)',
        }),
});

const UserUpdateSchema = UserSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: 'At least one field must be provided for update',
        path: ['body'],
    }
);

export { UserSchema, UserUpdateSchema };
