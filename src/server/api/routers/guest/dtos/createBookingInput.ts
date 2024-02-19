import {z} from 'zod';

export const CreateBookingInput = z.object({
    roomId: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    totalPrice: z.number(),
    days: z.number(),
});