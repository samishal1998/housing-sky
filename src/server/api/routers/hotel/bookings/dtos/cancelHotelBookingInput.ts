import {z} from 'zod';

export const CancelHotelBookingInput = z.object({
    bookingId: z.string().cuid(),
    cancelReason: z.string().optional(),
});