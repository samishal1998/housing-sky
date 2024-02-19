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
	ManageHotelDetails = 'ManageHotelDetails',
	HotelRooms = 'HotelRooms',
	HotelCreateRoom = 'HotelCreateRoom',
	HotelEditRoom = 'HotelEditRoom',
	HotelBookings = 'HotelBookings',
	HotelRegistration = 'HotelRegistration',
	RoomDetails = 'RoomDetails',
	GuestBookings = 'GuestBookings',
	RoomsGallery = 'RoomsGallery',
	SignUp = 'SignUp',
	SignIn = 'SignIn',
	UserProfile = 'UserProfile',
}

export type RoutesParams = {
	[Pages.Home]: NonNullable<unknown>;
	[Pages.ManageHotelDetails]: NonNullable<unknown>;
	[Pages.HotelRooms]: NonNullable<unknown>;
	[Pages.HotelCreateRoom]: NonNullable<unknown>;
	[Pages.HotelEditRoom]: { id: string };
	[Pages.HotelBookings]: NonNullable<unknown>;
	[Pages.GuestBookings]: NonNullable<unknown>;
	[Pages.RoomsGallery]: NonNullable<unknown>;
	[Pages.RoomDetails]: {id:string};
	[Pages.SignUp]: NonNullable<unknown>;
	[Pages.SignIn]: NonNullable<unknown>;
	[Pages.HotelRegistration]: NonNullable<unknown>;
	[Pages.UserProfile]: NonNullable<unknown>;
};

export const routes = {
	[Pages.Home]: new PageRoute<Pages.Home>('/'),
	[Pages.HotelRooms]: new PageRoute<Pages.HotelRooms>('/hotel/rooms'),
	[Pages.HotelCreateRoom]: new PageRoute<Pages.HotelCreateRoom>('/hotel/rooms/create'),
	[Pages.HotelEditRoom]: new PageRoute<Pages.HotelEditRoom>('/hotel/rooms/edit/:id'),
	[Pages.HotelBookings]: new PageRoute<Pages.HotelBookings>('/hotel/bookings'),
	[Pages.HotelRegistration]: new PageRoute<Pages.HotelRegistration>('/hotel/register'),
	[Pages.ManageHotelDetails]: new PageRoute<Pages.ManageHotelDetails>('/hotel/settings/profile'),
	[Pages.RoomDetails]: new PageRoute<Pages.RoomDetails>('/rooms/:id'),
	[Pages.RoomsGallery]: new PageRoute<Pages.RoomsGallery>('/rooms'),
	[Pages.UserProfile]: new PageRoute<Pages.ManageHotelDetails>('/profile'),
	[Pages.GuestBookings]: new PageRoute<Pages.GuestBookings>('/guest/bookings'),
	[Pages.SignUp]: new PageRoute<Pages.SignUp>('/signup'),
	[Pages.SignIn]: new PageRoute<Pages.SignIn>('/signin'),
} as const;
