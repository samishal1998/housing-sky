import {useRouter} from 'next/router';
import {Menubar, MenubarMenu, MenubarTrigger} from '~/components/ui/menubar';
import Link from 'next/link';
import {BookText, HomeIcon, LayoutDashboardIcon} from 'lucide-react';
import {routes} from '~/routes/router';
import React from 'react';

export function GuestMenuBar() {
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
                    <Link href={routes.RoomsGallery.generatePath()}>
                        {' '}
                        <LayoutDashboardIcon
                            className={'inline'}
                            strokeWidth={1.5}
                            absoluteStrokeWidth
                        />{' '}
                        <span className={'hidden text-sm font-semibold sm:inline'}>Rooms</span>
                    </Link>
                </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>
                    <Link href={routes.GuestBookings.generatePath()}>
                        <BookText className={'inline'} strokeWidth={1.5} absoluteStrokeWidth/>{' '}
                        <span className={'hidden text-sm font-semibold sm:inline'}>Bookings</span>
                    </Link>
                </MenubarTrigger>
            </MenubarMenu>
        </Menubar>
    );
}