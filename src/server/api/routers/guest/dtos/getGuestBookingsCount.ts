import {z} from 'zod';

export const GetGuestBookingsCount = z.object({
    status: z.string().array().optional(),
});