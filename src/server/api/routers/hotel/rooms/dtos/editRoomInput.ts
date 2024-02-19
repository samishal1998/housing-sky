import {z} from "zod";
import {RoomType} from "@prisma/client";

export const EditRoomInput = z.object({
    roomId: z.string().cuid(),
    pricePerDay: z.number().positive().optional(),
    type: z.enum([RoomType.DOUBLE,RoomType.SINGLE,RoomType.PRESIDENTIAL]).optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    floor: z.number().positive().optional(),
    space: z.string().optional(),
    vatPercentage: z.number().positive().optional(),
    images: z.string().array().min(1).optional(),

})