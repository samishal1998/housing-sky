import {z} from 'zod';

export const CreateUserInput = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string().min(8),
});