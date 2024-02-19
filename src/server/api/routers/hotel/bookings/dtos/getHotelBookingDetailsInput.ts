import {z} from 'zod';

export const GetHotelBookingDetailsInput = z.object({bookingId: z.string().cuid()});