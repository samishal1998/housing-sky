import {z} from 'zod';
import {BookingStatus} from ".prisma/client";

export const UpdateBookingStatusInput = z.object({
    bookingId: z.string().cuid(),
    status: z.enum([
        BookingStatus.ACCEPTED,
        BookingStatus.CANCELED,
        BookingStatus.PENDING_RESPONSE,
        BookingStatus.REJECTED,
    ]),
});