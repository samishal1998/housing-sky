/**
 * To Add a new page:
 * 1- Add it to enum.
 * 2- use the enum to define they type of RoutesParams for that page
 * 3- use the enum and PageRoute class to map the route `{ ... [Pages.<enumValue>]: new PageRoute<Pages.<enumValue>>(<Path>) ... }`
 */
import { BasePageRoute } from './helpers/basePageRoute';

export class PageRoute<P extends Pages> extends BasePageRoute<RoutesParams[P]> {}

enum Pages {
	Home = 'Home',
	Login = 'Login',
	HotelDashboard = 'HotelDashboard',
	HotelRooms = 'HotelRooms',
	HotelCreateRoom = 'HotelCreateRoom',
	HotelEditRoom = 'HotelEditRoom',
	HotelBookings = 'HotelBookings',
}

export type RoutesParams = {
	[Pages.Home]: NonNullable<unknown>;
	[Pages.Login]: NonNullable<unknown>;
	[Pages.HotelDashboard]: NonNullable<unknown>;
	[Pages.HotelRooms]: NonNullable<unknown>;
	[Pages.HotelCreateRoom]: NonNullable<unknown>;
	[Pages.HotelEditRoom]: { id: string };
	[Pages.HotelBookings]: NonNullable<unknown>;
};

export const routes = {
	[Pages.Home]: new PageRoute<Pages.Home>('/'),
	[Pages.Login]: new PageRoute<Pages.Login>('/login'),
	[Pages.HotelDashboard]: new PageRoute<Pages.HotelDashboard>('/hotel'),
	[Pages.HotelRooms]: new PageRoute<Pages.HotelRooms>('/hotel/rooms'),
	[Pages.HotelCreateRoom]: new PageRoute<Pages.HotelCreateRoom>('/hotel/rooms/create'),
	[Pages.HotelEditRoom]: new PageRoute<Pages.HotelEditRoom>('/hotel/rooms/:id'),
	[Pages.HotelBookings]: new PageRoute<Pages.HotelBookings>('/hotel/bookings'),
} as const;
