import {z} from 'zod';

export const GetUserInput = z.object({userId: z.string().cuid()}).optional();