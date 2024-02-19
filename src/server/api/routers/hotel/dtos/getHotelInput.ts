import {z} from 'zod';

export const GetHotelInput = z.object({hotelId: z.string().optional()}).optional();