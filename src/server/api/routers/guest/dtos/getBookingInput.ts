import {z} from 'zod';

export const GetBookingInput = z.object({bookingId: z.string().cuid()});