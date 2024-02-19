import {z} from 'zod';

export const GetHotelBookingsCount = z.object({status: z.string().array().optional()}).optional();