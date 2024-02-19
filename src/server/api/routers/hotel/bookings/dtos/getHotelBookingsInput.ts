import {z} from 'zod';

export const GetHotelBookingsInput = z.object({
    take: z.number(),
    skip: z.number(),
    status: z.string().array().optional(),
});