import {z} from 'zod';

export const GetHotelRoomsInput = z.object({
    skip: z.number(),
    take: z.number(),
});