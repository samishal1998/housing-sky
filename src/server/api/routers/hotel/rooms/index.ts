import { createTRPCRouter, hotelManagerProcedure } from '~/server/api/trpc';
import { CreateRoomInput } from '~/server/api/routers/hotel/rooms/dtos/createRoomInput';
import { assert } from '~/utils/assert';
import { EditRoomInput } from '~/server/api/routers/hotel/rooms/dtos/editRoomInput';
import { deleteFile, uploadFileFromBase64 } from '~/server/firebase-storage';
import { createId, isCuid } from '@paralleldrive/cuid2';
import { TRPCError } from '@trpc/server';
import { GetHotelRoomsInput } from '~/server/api/routers/hotel/rooms/dtos/getHotelRoomsInput';
import { RoomIdInput } from '~/server/api/routers/hotel/rooms/dtos/roomIdInput';

export const hotelMangerRoomsRouter = createTRPCRouter({
	create: hotelManagerProcedure.input(CreateRoomInput).mutation(async ({ ctx, input }) => {
		const { pricePerDay, type, name, description, floor, space, vatPercentage } = input;

		const images = [];
		try {
			for (const image of input.images) {
				const id = createId();
				await uploadFileFromBase64(ctx.firebaseApp, id, image);
				images.push(id);
			}
			const room = await ctx.db.room.create({
				data: {
					hotel: { connect: { id: ctx.hotel.id } },
					createdBy: { connect: { id: ctx.hotelManager.id } },
					pricePerDay,
					images,
					type,
					name,
					description,
					floor,
					space,
					vatPercentage,
				},
			});
			return {
				room,
			};
		} catch (e) {
			for (const image of images) {
				await deleteFile(ctx.firebaseApp, image);
			}
			throw new TRPCError({
				message: 'Failed to upload image',
				code: 'INTERNAL_SERVER_ERROR',
			});
		}
	}),

	edit: hotelManagerProcedure.input(EditRoomInput).mutation(async ({ ctx, input }) => {
		const { roomId, pricePerDay, type, name, description, floor, space, vatPercentage } = input;

		const room = await ctx.db.room.findUnique({
			where: { id: roomId },
		});
		assert(room, 'room-not-found', 'NOT_FOUND');
		assert(ctx.hotel.id === room!.hotelId, 'no-access-to-room', 'UNAUTHORIZED');

		let finalImages = undefined;
		const newImages = [];
		const toBeDeletedImages = new Set(room!.images);
		try {
			const fields: any = {};

			if (input.images) {
				finalImages = [];
				for (const image of input.images) {
					if (isCuid(image)) {
						finalImages.push(image);
						toBeDeletedImages.delete(image);
						continue;
					}
					const id = createId();
					await uploadFileFromBase64(ctx.firebaseApp, id, image);
					newImages.push(id);
					finalImages.push(id);
				}
				fields.images = finalImages;
			}

			const updatedRoom = await ctx.db.room.update({
				where: {
					id: roomId,
				},
				data: {
					pricePerDay,
					type,
					name,
					description,
					floor,
					space,
					vatPercentage,
					...fields,
				},
			});
			try {
				for (const image of toBeDeletedImages) {
					await deleteFile(ctx.firebaseApp, image);
				}
			} catch (e) {
				console.error(e);
			}
			return {
				room: updatedRoom,
			};
		} catch (e) {
			for (const image of newImages) {
				await deleteFile(ctx.firebaseApp, image);
			}
			throw new TRPCError({
				message: 'Failed to upload image',
				code: 'INTERNAL_SERVER_ERROR',
			});
		}
	}),

	getCount: hotelManagerProcedure.query(async ({ ctx }) => {
		const count = await ctx.db.room.count({
			where: { isActive: true, hotelId: ctx.hotel.id },
		});
		return {
			count,
		};
	}),

	getAll: hotelManagerProcedure.input(GetHotelRoomsInput).query(async ({ ctx, input }) => {
		return {
			rooms: await ctx.db.room.findMany({
				where: {
					isActive: true,
					hotel: { id: ctx.hotel.id },
				},
				skip: input.skip,
				take: input.take,
			}),
		};
	}),

	get: hotelManagerProcedure.input(RoomIdInput).query(async ({ ctx, input }) => {
		const room = await ctx.db.room.findUnique({
			where: {
				id: input.roomId,
			},
			include: {
				hotel: true,
			},
		});
		assert(room, 'room not found', 'NOT_FOUND');
		assert(room!.hotelId === ctx.hotel.id, 'you do not have access to this room', 'FORBIDDEN');
		return {
			room,
		};
	}),

	archive: hotelManagerProcedure.input(RoomIdInput).mutation(async ({ ctx, input }) => {
		const room = await ctx.db.room.findUnique({
			where: { id: input.roomId },
		});
		assert(room, 'room-not-found', 'NOT_FOUND');
		assert(ctx.hotel.id === room!.hotelId, 'you do not access to this room', 'FORBIDDEN');
		return {
			room: await ctx.db.room.update({
				where: {
					id: input.roomId,
				},
				data: {
					isActive: false,
					bookings: {
						updateMany: {
							where: { status: 'PENDING_RESPONSE' },
							data: {
								status: 'REJECTED',
							},
						},
					},
				},
			}),
		};
	}),
});
