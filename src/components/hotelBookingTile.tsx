import { type Booking, BookingStatus } from '.prisma/client';
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

export function HotelBookingTile({ booking }: { booking: Booking }) {
	const userQuery = api.users.get.useQuery({ userId: booking.createdById });
	const user = useMemo(() => userQuery.data?.user, [userQuery]);
	const roomQuery = api.hotels.rooms.get.useQuery({ roomId: booking.roomId });
	const room = useMemo(() => roomQuery.data?.room, [roomQuery]);
	const updateBookingMut = api.hotels.bookings.updateStatus.useMutation();
	const cancelBookingMut = api.hotels.bookings.cancel.useMutation();
	const queryClient = useQueryClient();

	const handleUpdateBookingStatus = useCallback(
		async (status: BookingStatus) => {
			try {
				if(status === 'CANCELED'){
					await cancelBookingMut.mutateAsync({
						cancelReason: '',
						bookingId: booking.id,
					});
				}else{
				await updateBookingMut.mutateAsync({
					status,
					bookingId: booking.id,
				});}
				await queryClient.invalidateQueries();
				toast('Updated Booking Successfully', { important: true });
			} catch (e) {
				console.log(e);
				toast('Failed to Update Booking', { important: true });
			}
		},
		[booking.id, cancelBookingMut, queryClient, updateBookingMut],
	);

	return (
		<div
			className={
				'flex flex-col items-end gap-2 rounded-2xl bg-white p-5 shadow-md ring-1 ring-neutral-300 w-full'
			}>
			<div className={'grid grid-cols-1 md:grid-cols-3 justify-center gap-3 w-full  '}>
				<div className={'flex flex-col'}>
					<div className={'flex flex-row gap-2'}>
						<h1 className={'text-xl font-medium'}>{room?.name}</h1>
						<div>
							<BookingStatusTag status={booking.status} />
						</div>
					</div>
					<div>
						<span>Booked By</span> {user?.name}
					</div>
				</div>

				<div>
					{format(booking.startDate, 'do LLL yy')} -{' '}
					{format(booking.endDate, 'do LLL yy')}
					<br />
					{differenceInDays(booking.endDate, booking.startDate) + 1} Days
				</div>
				<div className={'grid grid-cols-2 max-w-[22ch]'}>
					<span className={'font-semibold'}>Subtotal</span>{' '}
					<span className={'text-right'}> {booking.subTotal}$USD</span>
					<span className={'font-semibold'}>VAT</span>{' '}
					<span className={'text-right'}> {booking.vat}$USD</span>
					<span className={'font-semibold'}>Total</span>{' '}
					<span className={'text-right'}> {booking.totalPrice}$USD</span>
				</div>
			</div>

			{booking.status === 'PENDING_RESPONSE' && (
				<div className={'grid grid-cols-1 justify-items-end gap-2 lg:grid-cols-2'}>
					<Button
						color={'green'}
						variant={'outline'}
						size={'sm'}
						asChild
						disabled={updateBookingMut.isLoading}
						onClick={() => handleUpdateBookingStatus(BookingStatus.ACCEPTED)}>
						<LoadingButton loading={updateBookingMut.isLoading}>Accept</LoadingButton>
					</Button>
					<Button
						className={cn('text-destructive ring-destructive ring-1')}
						color={'red'}
						variant={'outline'}
						size={'sm'}
						asChild
						disabled={updateBookingMut.isLoading}
						onClick={() => handleUpdateBookingStatus(BookingStatus.REJECTED)}>
						<LoadingButton loading={updateBookingMut.isLoading}>Reject</LoadingButton>
					</Button>
				</div>
			)}
			{booking.status === 'ACCEPTED' && (
				<div className={'grid grid-cols-1 justify-items-end gap-2 '}>
					<Button
						className={cn('text-destructive ring-destructive ring-1')}
						color={'red'}
						variant={'outline'}
						size={'sm'}
						asChild
						disabled={cancelBookingMut.isLoading}
						onClick={() => handleUpdateBookingStatus(BookingStatus.CANCELED)}>
						<LoadingButton loading={cancelBookingMut.isLoading}>Cancel</LoadingButton>
					</Button>
				</div>
			)}
		</div>
	);
}

