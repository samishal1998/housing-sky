import {z} from 'zod';

export const RoomIdInput = z.object({roomId: z.string()});