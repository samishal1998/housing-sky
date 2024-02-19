import {
	createTRPCRouter,
	hotelManagerProcedure,
	protectedProcedure,
	publicProcedure,
} from '~/server/api/trpc';
import { hotelMangerRoomsRouter } from '~/server/api/routers/hotel/rooms';
import { assert, assertNot } from '~/utils/assert';
import { hotelBookingsRouter } from '~/server/api/routers/hotel/bookings';
import { uploadFileFromBase64 } from '~/server/firebase-storage';
import { TRPCError } from '@trpc/server';
import { createId } from '@paralleldrive/cuid2';
import sha1 from '~/utils/sha1';
import { RegisterHotelInput } from '~/server/api/routers/hotel/dtos/registerHotelInput';
import { UpdateHotelInput } from '~/server/api/routers/hotel/dtos/updateHotelInput';
import { GetHotelInput } from '~/server/api/routers/hotel/dtos/getHotelInput';
import { RegisterHotelWithExistingUserInput } from '~/server/api/routers/hotel/dtos/registerHotelWithExistingUserInput';

export const hotelsRouter = createTRPCRouter({
	get: publicProcedure.input(GetHotelInput).query(async ({ ctx, input }) => {
		assert(
			!!input?.hotelId || ctx.session?.user.role === 'HOTEL_MANAGER',
			'Please Pass HotelID',
		);

		if (input?.hotelId) return ctx.db.hotel.findUniqueOrThrow({ where: { id: input.hotelId } });

		return ctx.db.hotel.findFirstOrThrow({
			where: { hotelManagers: { some: { userId: ctx.session?.user.id } } },
		});
	}),

	register: publicProcedure.input(RegisterHotelInput).mutation(async ({ ctx, input }) => {
		const { address, description, name, username, image, email, password } = input;

		const hotelId = createId();
		if (image) {
			try {
				await uploadFileFromBase64(ctx.firebaseApp, hotelId, image);
			} catch (e) {
				throw new TRPCError({
					message: 'image-upload-failed',
					code: 'INTERNAL_SERVER_ERROR',
				});
			}
		}
		return ctx.db.hotel.create({
			data: {
				id: hotelId,
				address,
				description,
				name,
				hotelManagers: {
					create: {
						user: {
							create: {
								name: username ?? name,
								email,
								passwordHash: sha1(password),
								role:'HOTEL_MANAGER'
							},
						},
					},
				},
			},
		});
	}),

	registerWithExistingUser: protectedProcedure.input(RegisterHotelWithExistingUserInput)
		.mutation(async ({ ctx, input }) => {
			const { address, description, name, image } = input;

			const user = await ctx.db.user.findUnique({
				where: { id: ctx.session.user.id },
				include: { hotelAccess: true },
			});

			assert(user, 'user-not-found', 'NOT_FOUND');
			assertNot(user?.hotelAccess, 'user-already-has-hotel');
			const hotelId = createId();

			if (image) {
				try {
					await uploadFileFromBase64(ctx.firebaseApp, hotelId, image);
				} catch (e) {
					throw new TRPCError({
						message: 'image-upload-failed',
						code: 'INTERNAL_SERVER_ERROR',
					});
				}
			}
			return ctx.db.hotel.create({
				data: {
					id: hotelId,
					address,
					description,
					name,
					hotelManagers: {
						create: {
							user: { create: { id: user!.id ,role:'HOTEL_MANAGER'} ,},
						},
					},
				},
			});
		}),

	update: hotelManagerProcedure.input(UpdateHotelInput).mutation(async ({ ctx, input }) => {
		const { address, description, name, image } = input;

		if (image) {
			try {
				await uploadFileFromBase64(ctx.firebaseApp, ctx.hotel.id, image);
			} catch (e) {
				throw new TRPCError({
					message: 'image-upload-failed',
					code: 'INTERNAL_SERVER_ERROR',
				});
			}
		}
		return ctx.db.hotel.update({
			where: { id: ctx.hotel.id },
			data: {
				address,
				description,
				name,
			},
		});
	}),

	rooms: hotelMangerRoomsRouter,

	bookings: hotelBookingsRouter,
});
