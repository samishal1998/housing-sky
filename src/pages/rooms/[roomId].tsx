import { GetServerSideProps, NextPage } from 'next';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { z } from 'zod';
import {signIn, useSession} from 'next-auth/react';
import { createContext, useEffect, useMemo } from 'react';
import { FormikProvider, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { toast } from 'sonner';
import { FormikFormField } from '~/components/forms/formField';
import { FormikTextAreaField } from '~/components/forms/formTextAreaField';
import { Button } from '~/components/ui/button';
import { LoadingButton } from '~/components/loadingButton';
import { DatePickerWithRange } from '~/components/ui/date-range-picker';
import { Matcher } from 'react-day-picker';
import { differenceInDays } from 'date-fns';
import { CreateBookingInput } from '~/server/api/routers/guest/dtos/createBookingInput';
import { checkIfDateRangeOverlapsMatchers } from '~/utils/dates';
import { AlertTriangleIcon } from 'lucide-react';
import * as React from 'react';
import Layout from '~/components/layouts/layout';
import ReactFullscreenSlideshow from 'react-fullscreen-slideshow';
import { getPublicImageUrlFromPath } from '~/utils/storage-helpers';
import { CircularProgress } from '~/components/circularProgress';
import { Room } from '@prisma/client';
import { Booking } from '.prisma/client';
import { routes } from '~/routes/router';
import {Skeleton} from "~/components/ui/skeleton";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";

const CreateBookingFormSchema = CreateBookingInput;
type CreateBookingFormValues = Partial<
	z.infer<typeof CreateBookingFormSchema> & {
		subtotal: number;
		vat: number;
	}
>;

const RoomDetails: NextPage = () => {
	const router = useRouter();
	const query = router.query;
	const session = useSession();
	const roomBookedDatesQuery = api.rooms.getRoomWithBookedDates.useQuery({
		roomId: query.roomId as string,
	});
	const room = useMemo(() => roomBookedDatesQuery.data?.room, [roomBookedDatesQuery]);

	return (
		<Layout>
			{!room ? (
				<CircularProgress />
			) : (
				<>
					<div className={'overflow-hidden rounded-2xl'}>
						{ typeof window !== 'undefined' &&
						<ReactFullscreenSlideshow
							height={'60vh'}
							images={room.images.map((image) => ({
								image: getPublicImageUrlFromPath(image),
								caption: room.name,
								description: room.description ?? '',
							}))}
							cycle={false}
							title={room.name}
						/>}
					</div>
					<div
						className={
							'relative grid grid-cols-1 items-start justify-start py-5 lg:grid-cols-2'
						}>
						<div className={'px-3 '}>
							<h1 className={'text-2xl font-bold '}>{room.name}</h1>
							<HotelTile hotelId={room.hotelId}/>
							<div className={'text-lg font-semibold text-neutral-500'}>Description</div>
							<div className={'text-xl font-medium text-neutral-800 pl-3'}>
								<div >{room.description}</div>
								<div><span className={'font-semibold text-neutral-500'}>Floor</span> {room.floor}</div>
								<div><span className={'font-semibold text-neutral-500'}>Room Space</span> {room.space}</div>
								<div><span className={'font-semibold text-neutral-500'}>Room Type</span> {room.type}</div>
							</div>
						</div>
						<BookRoomForm room={room} />
					</div>
				</>
			)}
		</Layout>
	);
};
export default RoomDetails;

const BookRoomForm = ({ room }: { room: Room & { bookings: Booking[] } }) => {
	const session = useSession();
	const router = useRouter();

	const disabledDates: Matcher[] = useMemo(() => {
		const dates: Matcher[] = [{ before: new Date() }];
		if (room) {
			room.bookings.forEach(({ startDate: from, endDate: to }) => {
				dates.push({ from, to });
			});
		}
		return dates;
	}, [room]);
	const bookRoomMutation = api.guest.bookings.create.useMutation();

	const form = useFormik<CreateBookingFormValues>({
		initialValues: {
			totalPrice: 0,
			endDate: undefined,
			roomId: room.id as string,
			startDate: undefined,
			days: 0,
		},
		validationSchema: toFormikValidationSchema(CreateBookingFormSchema),
		async onSubmit(values, helpers) {
			if(session.status === 'unauthenticated'){
				await signIn()
				return;
			}
			try {
				if (
					checkIfDateRangeOverlapsMatchers(disabledDates, {
						from: values.startDate,
						to: values.endDate,
					})
				) {
					toast(
						<>
							{' '}
							<AlertTriangleIcon
								className={'text-red-500'}
								strokeWidth={2}
								size={28}
							/>{' '}
							Please Select a valid date range
						</>,
					);
					return;
				}
				await bookRoomMutation.mutateAsync(values as any);
				toast('Booked Room Successfully', { important: true });
				setTimeout(() => {
					router.replace(routes.GuestBookings.generatePath()).catch(console.error);
				}, 3000);
			} catch (e) {
				console.log(e);
				toast('Failed to Book Room', { important: true });
			}
		},
	});

	return (
		<>
			<FormikProvider value={form}>
				<form className="sticky top-0 flex w-full max-w-screen-md flex-col justify-center items-center gap-4 rounded-2xl p-8 px-6 py-12 shadow-lg lg:px-8">
					<h1 className={'text-center text-2xl font-semibold'}>Booking Room</h1>
					<h1 className={'text-center text-xl font-medium text-neutral-500'}>{room.pricePerDay} $USD/day</h1>
					<DatePickerWithRange

						disabled={disabledDates}
						date={{
							from: form.values.startDate,
							to: form.values.endDate,
						}}
						onDatesChanged={async (dateRange) => {
							if (dateRange) {
								await form.setFieldValue('startDate', dateRange.from);
								await form.setFieldValue('endDate', dateRange.to);
								if (dateRange.from && dateRange.to) {
									const days = differenceInDays(dateRange.to, dateRange.from) + 1;
									const subtotal = room.pricePerDay * days;
									const vat = Math.round(subtotal * (room.vatPercentage / 100));
									const totalPrice = subtotal + vat;
									await form.setFieldValue('totalPrice', totalPrice);
									await form.setFieldValue('subtotal', subtotal);
									await form.setFieldValue('vat', vat);
									await form.setFieldValue('days', days);
								}
							}
						}}
					/>

					<div className={'grid w-fit grid-cols-2 gap-3 w-full'}>
						<p
							className={
								'odd:font-bold even:text-right even:font-medium even:text-neutral-600'
							}>
							Booked Days
						</p>
						<p
							className={
								'odd:font-bold even:text-right even:font-medium even:text-neutral-600'
							}>
							{' '}
							{form.values.days} Day{((form.values.days??0) >1) && 's'}
						</p>
						<p
							className={
								'odd:font-bold even:text-right even:font-medium even:text-neutral-600'
							}>
							SubTotal
						</p>
						<p
							className={
								'odd:font-bold even:text-right even:font-medium even:text-neutral-600'
							}>
							{' '}
							{form.values.subtotal} $USD
						</p>
						<p
							className={
								'odd:font-bold even:text-right even:font-medium even:text-neutral-600'
							}>
							VAT ({room.vatPercentage}%)
						</p>
						<p
							className={
								'odd:font-bold even:text-right even:font-medium even:text-neutral-600'
							}>
							{' '}
							{form.values.vat} $USD
						</p>
						<p
							className={
								'odd:font-bold even:text-right even:font-medium even:text-neutral-600'
							}>
							Total Price
						</p>
						<p
							className={
								'odd:font-bold even:text-right even:font-medium even:text-neutral-600'
							}>
							{' '}
							{form.values.totalPrice} $USD
						</p>
					</div>
										
					<Button
						className={'w-full'}
						onClick={(session.status === 'unauthenticated')? signIn
						 :form.handleSubmit as any}
						disabled={session.data?.user.role === 'HOTEL_MANAGER'}
						type={'submit'}>
						<LoadingButton
							
							loading={form.isSubmitting}
							disabled={session.data?.user.role === 'HOTEL_MANAGER'}>
							Book Room
						</LoadingButton>
					</Button>
				</form>
			</FormikProvider>
		</>
	);
};
const HotelTile = ({hotelId}:{hotelId:string})=>{
	const hotelQuery = api.hotels.get.useQuery({hotelId},{enabled:!!hotelId})
	if(hotelQuery.isLoading){
		return <div className={'ring-2 ring-primary/40 flex flex-row p-4 items-center justify-start bg-background rounded-2xl w-fit gap-3 my-2'}>
			<Skeleton className={'rounded-full aspect-square w-16'}/>
			<div className="space-y-2">
				<Skeleton className="h-4 w-[250px]" />
				<Skeleton className="h-4 w-[200px]" />
			</div>
		</div>
	}
	if(!hotelQuery.data) return <></>
	return <div className={'ring-2 ring-primary/40 flex flex-row p-4 items-center justify-start bg-background rounded-2xl w-fit gap-3 my-2 min-w-[60%]'}>
		<Avatar className={'w-16 h-16 aspect-square font-bold'}>
			<AvatarImage src={hotelQuery.data.id? getPublicImageUrlFromPath(hotelQuery.data.id) :''} />
			<AvatarFallback >{hotelQuery.data.name.replaceAll(/(\w)\w+\s*/g,"$1")}</AvatarFallback>
		</Avatar>
		<h3 className={'text-xl font-semibold'}>{hotelQuery.data?.name}</h3>
	</div>
}