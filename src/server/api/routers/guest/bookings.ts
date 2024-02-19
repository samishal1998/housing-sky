import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { $Enums } from '.prisma/client';
import { CreateBookingInput } from '~/server/api/routers/guest/dtos/createBookingInput';
import { differenceInDays } from 'date-fns';
import { assert } from '~/utils/assert';
import { GetGuestBookingsCount } from '~/server/api/routers/guest/dtos/getGuestBookingsCount';
import { GetGuestBookingsProcedure } from '~/server/api/routers/guest/dtos/getGuestBookingsProcedure';
import { GetBookingInput } from '~/server/api/routers/guest/dtos/getBookingInput';
import { CancelBookingInput } from '~/server/api/routers/guest/dtos/cancelBookingInput';
import BookingStatus = $Enums.BookingStatus;

export const guestBookingsRouter = createTRPCRouter({
	getAll: protectedProcedure.input(GetGuestBookingsProcedure).query(async ({ ctx, input }) => {
		const filters: any = {};
		if (input.status) {
			filters.status = { in: input.status };
		}
		const bookings = await ctx.db.booking.findMany({
			where: {
				createdById: ctx.session.user.id,
				...filters,
			},
			take: input.take,
			skip: input.skip,
		});
		return { bookings };
	}),
	getCount: protectedProcedure.input(GetGuestBookingsCount).query(async ({ ctx, input }) => {
		const filters: any = {};
		if (input.status) {
			filters.status = { in: input.status };
		}
		const count = await ctx.db.booking.count({
			where: {
				createdById: ctx.session.user.id,
				...filters,
			},
		});

		return { count };
	}),

	get: protectedProcedure.input(GetBookingInput).query(async ({ ctx, input }) => {
		const booking = await ctx.db.booking.findUnique({
			where: {
				createdById: ctx.session.user.id,
				id: input.bookingId,
			},
		});
		if (!booking)
			throw new TRPCError({
				message: "booking not found or you don't have access to it",
				code: 'BAD_REQUEST',
			});
		return booking;
	}),

	create: protectedProcedure.input(CreateBookingInput).mutation(async ({ ctx, input }) => {
		const { startDate, endDate, roomId } = input;

		const room = await ctx.db.room.findUnique({
			where: { id: roomId },
		});
		if (!room) throw new TRPCError({ message: 'room not found', code: 'NOT_FOUND' });

		const duration = differenceInDays(endDate, startDate) + 1;
		const subTotal = duration * room.pricePerDay;
		const tax = Math.round((subTotal * room.vatPercentage) / 100);
		const total = subTotal + tax;

		if (total !== input.totalPrice)
			throw new TRPCError({ message: 'please confirm total price', code: 'BAD_REQUEST' });

		return ctx.db.booking.create({
			data: {
				startDate,
				endDate,
				createdBy: { connect: { id: ctx.session.user.id } },
				room: { connect: { id: roomId } },
				pricePerDay: room.pricePerDay,
				totalPrice: total,
				subTotal,
				vat: tax,
			},
		});
	}),

	cancel: protectedProcedure.input(CancelBookingInput).mutation(async ({ ctx, input }) => {
		const booking = await ctx.db.booking.findUnique({ where: { id: input.bookingId } });
		assert(booking, 'unknown booking', 'NOT_FOUND');
		assert(
			booking!.createdById === ctx.session.user.id,
			'you are not allowed to modify this booking',
			'FORBIDDEN',
		);
		assert(
			BookingStatus.ACCEPTED === booking!.status ||
				BookingStatus.PENDING_RESPONSE === booking!.status,
			'booking already voided',
		);
		assert(
			new Date().valueOf() < booking!.startDate.valueOf(),
			'booking start date has already passed',
		);

		return ctx.db.booking.update({
			where: { id: booking!.id },
			data: {
				status: BookingStatus.CANCELED,
			},
		});
	}),
});
