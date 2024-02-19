import {z} from 'zod';

export const RegisterHotelWithExistingUserInput = z.object({
    address: z.string(),
    description: z.string(),
    name: z.string(),
    image: z.string().optional(),
});