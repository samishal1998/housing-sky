import { createTRPCRouter } from '~/server/api/trpc';
import { guestBookingsRouter } from '~/server/api/routers/guest/bookings';

export const guestRouter = createTRPCRouter({
	bookings: guestBookingsRouter,
});
