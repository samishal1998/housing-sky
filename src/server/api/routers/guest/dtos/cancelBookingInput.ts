import {z} from 'zod';

export const CancelBookingInput = z.object({
    bookingId: z.string().cuid(),
    cancelReason: z.string().optional(),
});