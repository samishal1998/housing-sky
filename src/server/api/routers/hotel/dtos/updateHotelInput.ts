import {z} from 'zod';

export const UpdateHotelInput = z.object({
    address: z.string().optional(),
    description: z.string().optional(),
    name: z.string().optional(),
    image: z.string().optional(),
});