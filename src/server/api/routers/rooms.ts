import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

const GetRoomsInput = z.object({
	skip: z.number(),
	take: z.number(),
});
const GetRoomInput = z.object({ roomId: z.string() })
export const roomsRouter = createTRPCRouter({
	getCount: publicProcedure.query(async ({ ctx }) => {
		const count = await ctx.db.room.count({ where: { isActive: true } });
		return {
			count,
		};
	}),

	getAll: publicProcedure.input(GetRoomsInput).query(async ({ ctx, input }) => {
		return {
			rooms: await ctx.db.room.findMany({
				where: { isActive: true },
				skip: input.skip,
				take: input.take,
			}),
		};
	}),

	get: publicProcedure.input(GetRoomInput).query(async ({ ctx, input }) => {
		return {
			room: await ctx.db.room.findUniqueOrThrow({
				where: {
					id: input.roomId,
				},
				include: {
					hotel: true,
				},
			}),
		};
	}),

	getRoomWithBookedDates: publicProcedure.input(GetRoomInput).query(async ({ ctx, input }) => {
			const currentDate = new Date();
			const room = await ctx.db.room.findUniqueOrThrow({
				where: {
					id: input.roomId,
				},
				include: {
					bookings: {
						where: {
							status: { in: ['ACCEPTED', 'PENDING_RESPONSE'] },
							OR: [
								{
									startDate: { gte: currentDate },
								},
								{
									endDate: { gte: currentDate },
								},
							],
						},
					},
				},
			});

			return {
				room,
			};
		}),
});
