import { type Booking } from '.prisma/client';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/utils';
import { api } from '~/utils/api';
import { differenceInDays, format } from 'date-fns';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { LoadingButton } from '~/components/loadingButton';
import { BookingStatusTag } from '~/components/bookingStatusTag';

export function UserBookingTile({ booking }: { booking: Booking }) {
	const roomQuery = api.rooms.get.useQuery({ roomId: booking.roomId });
	const room = useMemo(() => roomQuery.data?.room, [roomQuery]);
	const cancelBookingMut = api.guest.bookings.cancel.useMutation();
	const queryClient = useQueryClient();

	const handleUpdateBookingStatus = useCallback(async () => {
		try {
			await cancelBookingMut.mutateAsync({
				cancelReason: '',
				bookingId: booking.id,
			});

			await queryClient.invalidateQueries();
			toast('Updated Booking Successfully', { important: true });
		} catch (e) {
			console.log(e);
			toast('Failed to Update Booking', { important: true });
		}
	}, [booking.id, cancelBookingMut, queryClient]);

	return (
		<div
			className={
				'flex w-full flex-col items-end gap-2 rounded-2xl bg-white p-5 shadow-md ring-1 ring-neutral-300'
			}>
			<div className={'grid w-full grid-cols-1 justify-center gap-3  md:grid-cols-3 '}>
				<div className={'flex flex-col'}>
					<div className={'flex flex-row gap-2'}>
						<h1 className={'text-xl font-medium'}>{room?.name}</h1>
						<div>
							<BookingStatusTag status={booking.status} />
						</div>
					</div>
					<div className={'text-neutral-600 dark:text-neutral-100'}>
						{room?.hotel?.name}
					</div>
				</div>

				<div>
					{format(booking.startDate, 'do LLL yy')} -{' '}
					{format(booking.endDate, 'do LLL yy')}
					<br />
					{differenceInDays(booking.endDate, booking.startDate) + 1} Days
				</div>
				<div className={'grid max-w-[22ch] grid-cols-2'}>
					<span className={'font-semibold'}>Subtotal</span>{' '}
					<span className={'text-right'}> {booking.subTotal}$USD</span>
					<span className={'font-semibold'}>VAT</span>{' '}
					<span className={'text-right'}> {booking.vat}$USD</span>
					<span className={'font-semibold'}>Total</span>{' '}
					<span className={'text-right'}> {booking.totalPrice}$USD</span>
				</div>
			</div>

			{(booking.status === 'PENDING_RESPONSE' || booking.status === 'ACCEPTED') && (
				<div className={'grid grid-cols-1 justify-items-end gap-2 '}>
					<Button
						className={cn('text-destructive ring-1 ring-destructive')}
						color={'red'}
						variant={'outline'}
						size={'sm'}
						asChild
						disabled={cancelBookingMut.isLoading}
						onClick={handleUpdateBookingStatus}>
						<LoadingButton loading={cancelBookingMut.isLoading}>Cancel</LoadingButton>
					</Button>
				</div>
			)}
		</div>
	);
}
