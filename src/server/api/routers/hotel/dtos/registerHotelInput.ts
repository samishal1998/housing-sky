import {z} from 'zod';

export const RegisterHotelInput = z.object({
    address: z.string().min(8),
    description: z.string().min(10),
    name: z.string().min(4),
    username: z.string().min(4).optional(),
    image: z.string().optional(),
    email: z.string().email(),
    password: z.string(),
});