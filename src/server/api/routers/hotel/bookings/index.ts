import { createTRPCRouter, hotelManagerProcedure } from '~/server/api/trpc';
import { $Enums } from '.prisma/client';
import { UpdateBookingStatusInput } from '~/server/api/routers/hotel/dtos/updateBookingStatusInput';
import { assert } from '~/utils/assert';
import { GetHotelBookingsCount } from '~/server/api/routers/hotel/bookings/dtos/getHotelBookingsCount';
import { GetHotelBookingsInput } from '~/server/api/routers/hotel/bookings/dtos/getHotelBookingsInput';
import { GetHotelBookingDetailsInput } from '~/server/api/routers/hotel/bookings/dtos/getHotelBookingDetailsInput';
import { CancelHotelBookingInput } from '~/server/api/routers/hotel/bookings/dtos/cancelHotelBookingInput';
import BookingStatus = $Enums.BookingStatus;

export const hotelBookingsRouter = createTRPCRouter({
	getAll: hotelManagerProcedure.input(GetHotelBookingsInput).query(async ({ ctx, input }) => {
		const filters: any = {};
		if (input.status) {
			filters.status = { in: input.status };
		}
		const bookings = await ctx.db.booking.findMany({
			where: {
				room: {
					isActive: true,
					hotel: { id: ctx.hotel.id },
				},
				...filters,
			},
			take: input.take,
			skip: input.skip,
		});
		return { bookings };
	}),

	getCount: hotelManagerProcedure.input(GetHotelBookingsCount).query(async ({ ctx, input }) => {
		const filters: any = {};
		if (input?.status) {
			filters.status = { in: input.status };
		}
		const count = await ctx.db.booking.count({
			where: {
				room: {
					isActive: true,
					hotel: { id: ctx.hotel.id },
				},
				...filters,
			},
		});

		return { count };
	}),

	get: hotelManagerProcedure.input(GetHotelBookingDetailsInput).query(async ({ ctx, input }) => {
		const booking = await ctx.db.booking.findUnique({
			where: {
				id: input.bookingId,
			},
			include: {
				room: { select: { hotelId: true } },
			},
		});
		assert(booking, 'booking not found', 'NOT_FOUND');
		assert(
			booking!.room.hotelId === ctx.hotel.id,
			"you don't have access to this booking",
			'FORBIDDEN',
		);
		return booking;
	}),

	cancel: hotelManagerProcedure
		.input(CancelHotelBookingInput)
		.mutation(async ({ ctx, input }) => {
			const booking = await ctx.db.booking.findUnique({
				where: { id: input.bookingId },
				include: { room: { select: { hotelId: true } } },
			});
			assert(booking, 'booking not found', 'NOT_FOUND');

			assert(
				booking!.room.hotelId === ctx.hotel.id,
				'you are not allowed to modify this booking',
				'FORBIDDEN',
			);

			assert(
				BookingStatus.ACCEPTED === booking!.status ||
					BookingStatus.PENDING_RESPONSE === booking!.status,
				'booking already voided',
				'BAD_REQUEST',
			);

			return ctx.db.booking.update({
				where: { id: booking!.id },
				data: {
					status: BookingStatus.CANCELED,
					closedBy: { connect: { id: ctx.hotelManager.id } },
				},
			});
		}),

	updateStatus: hotelManagerProcedure
		.input(UpdateBookingStatusInput)
		.mutation(async ({ ctx, input }) => {
			const booking = await ctx.db.booking.findUnique({
				where: { id: input.bookingId },
				include: { room: { select: { hotelId: true } } },
			});
			assert(booking, 'unknown booking', 'NOT_FOUND');

			assert(
				booking!.room.hotelId === ctx.hotel.id,
				'you are not allowed to modify this booking',
				'FORBIDDEN',
			);

			assert(
				BookingStatus.PENDING_RESPONSE === booking!.status,
				'can only update pending bookings',
				'BAD_REQUEST',
			);

			return ctx.db.booking.update({
				where: { id: booking!.id },
				data: {
					status: input.status,
					closedBy: { connect: { id: ctx.hotelManager.id } },
				},
			});
		}),
});
