import type { NextPage } from 'next';
import { api } from '~/utils/api';
import { useMemo, useState } from 'react';
import { CircularProgress } from '~/components/circularProgress';
import Layout from '~/components/layouts/layout';
import { Paginator } from '~/components/paginator';
import { UserBookingTile } from '~/components/userBookingTile';
import {useSession} from "next-auth/react";

const GuestBookingsList: NextPage = () => {
	const session = useSession();
	const [page, setPage] = useState(0);
	const [bookingsPerPage, setBookingsPerPage] = useState(10);
	const take = useMemo(() => bookingsPerPage, [page, bookingsPerPage]);
	const skip = useMemo(() => bookingsPerPage * page, [page, bookingsPerPage]);
	const bookingsCount = api.guest.bookings.getCount.useQuery({},{
		enabled: session.status === 'authenticated'
	});

	const pageCount = useMemo(
		() =>
			bookingsCount.data?.count ? Math.ceil(bookingsCount.data.count / bookingsPerPage) : 0,
		[bookingsPerPage, bookingsCount],
	);
	const bookings = api.guest.bookings.getAll.useQuery({ take, skip },{enabled: session.status === 'authenticated'});

	return (
		<Layout roleGuard={'GUEST'}>
			{bookings.isLoading || bookingsCount.isLoading ? (
				<div className={'my-auto grid h-full place-items-center'}>
					<CircularProgress />{' '}
				</div>
			) : (
				<div className={'grid grid-cols-1  place-items-center gap-4'}>
					{bookings.data?.bookings.map((booking) => {
						return <UserBookingTile key={booking.id} booking={booking} />;
					})}
				</div>
			)}
			<div className={'my-5'}>
				<Paginator
					pages={pageCount}
					currentPage={page}
					onPageSelected={(page) => setPage(page)}
				/>
			</div>
		</Layout>
	);
};
export default GuestBookingsList