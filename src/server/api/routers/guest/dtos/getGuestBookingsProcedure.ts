import {z} from 'zod';

export const GetGuestBookingsProcedure = z.object({
    take: z.number(),
    skip: z.number(),
    status: z.string().array().optional(),
});