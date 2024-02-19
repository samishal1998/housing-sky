import {z} from "zod";
import {RoomType} from "@prisma/client";

export const CreateRoomInput = z.object({
    pricePerDay: z.number().positive(),
    type: z.enum([RoomType.DOUBLE,RoomType.SINGLE,RoomType.PRESIDENTIAL]),
    name: z.string(),
    description: z.string(),
    floor: z.number().positive(),
    space: z.string(),
    vatPercentage: z.number().nonnegative(),
    images: z.string().array().min(1),

})