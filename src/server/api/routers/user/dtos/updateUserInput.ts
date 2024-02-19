import {z} from 'zod';

export const UpdateUserInput = z.object({
    password: z.string().optional(),
    name: z.string().optional(),
    image: z.string().optional(),
});