import {useRouter} from 'next/router';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from '~/components/ui/menubar';
import Link from 'next/link';
import {BookText, HomeIcon, LayoutDashboardIcon, LayoutList, PlusCircleIcon} from 'lucide-react';
import {routes} from '~/routes/router';
import React from 'react';

export function HotelManagerMenuBar() {
    const router = useRouter();

    return (
        <Menubar>
            {router.pathname === '/' || (
                <MenubarMenu>
                    <MenubarTrigger>
                        <Link href={'/'}>
                            <HomeIcon className={'inline'} strokeWidth={1.5} absoluteStrokeWidth/>{' '}
                            <span className={'hidden text-sm font-semibold sm:inline'}>Home</span>
                        </Link>
                    </MenubarTrigger>
                </MenubarMenu>
            )}
            <MenubarMenu>
                <MenubarTrigger>
                    <LayoutDashboardIcon
                        className={'inline'}
                        strokeWidth={1.5}
                        absoluteStrokeWidth
                    />{' '}
                    <span className={'hidden text-sm font-semibold sm:inline'}>Rooms</span>
                </MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        <Link href={routes.RoomsGallery.generatePath()}>
                            {' '}
                            <LayoutDashboardIcon
                                className={'inline'}
                                strokeWidth={1.5}
                                absoluteStrokeWidth
                            />{' '}
                            Rooms Gallery
                        </Link>
                    </MenubarItem>
                    <MenubarItem>
                        <Link href={routes.HotelRooms.generatePath()}>
                            {' '}
                            <LayoutList
                                className={'inline'}
                                strokeWidth={1.5}
                                absoluteStrokeWidth
                            />{' '}
                            Your Rooms List
                        </Link>
                    </MenubarItem>
                    <MenubarSeparator/>
                    <MenubarItem>
                        <Link href={routes.HotelCreateRoom.generatePath()}>
                            {' '}
                            <PlusCircleIcon
                                className={'inline'}
                                strokeWidth={1.5}
                                absoluteStrokeWidth
                            />{' '}
                            Create New Room
                        </Link>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>
                    <Link href={routes.HotelBookings.generatePath()}>
                        <BookText className={'inline'} strokeWidth={1.5} absoluteStrokeWidth/>{' '}
                        <span className={'hidden text-sm font-semibold sm:inline'}>Bookings</span>
                    </Link>
                </MenubarTrigger>
            </MenubarMenu>
        </Menubar>
    );
}