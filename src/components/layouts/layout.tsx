import React, { useEffect } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { ArrowRight, ChevronDown, LogOut, LucideUserCog, Settings } from 'lucide-react';
import { routes } from '~/routes/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '~/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { CircularProgress } from '~/components/circularProgress';
import { useRouter } from 'next/router';
import type { UserRole } from '@prisma/client';
import { cn } from '~/utils';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { getPublicImageUrlFromPath } from '~/utils/storage-helpers';
import { DefaultMenuBar } from '~/components/layouts/defaultMenuBar';
import { GuestMenuBar } from '~/components/layouts/guestMenuBar';
import { HotelManagerMenuBar } from '~/components/layouts/hotelManagerMenuBar';

const Layout = ({
	children,
	roleGuard,
	classes,
}: {
	children: any;
	roleGuard?: UserRole | 'SIGNED_IN';
	classes?: { main: string };
}) => {
	const router = useRouter();
	const { data, status } = useSession();

	const handleLogout = async () => {
		await signOut();
	};

	useEffect(() => {
		if (status === 'unauthenticated' && roleGuard) {
			signIn().catch(console.error);
		}
		if (
			status === 'authenticated' &&
			roleGuard &&
			roleGuard !== data?.user?.role &&
			roleGuard !== 'SIGNED_IN'
		) {
			router.replace('403').catch(console.error);
		}
	}, [status, roleGuard, data?.user, router]);

	return (
		<div className={'flex h-full min-h-screen flex-col bg-slate-50 dark:bg-neutral-900'}>
			<nav
				className={
					'mx-0 mt-5 flex w-full flex-row rounded-full bg-white py-5 shadow-lg dark:bg-neutral-800 dark:shadow-primary/10 sm:mx-10 sm:w-[calc(100%-5rem)] sm:px-10'
				}>
				<div className={'hidden flex-row items-center justify-start lg:flex'}>
					<h1
						className={clsx(
							'font-display  text-center text-2xl',
							' dark:via-primary-500 dark:to-primary-600 bg-gradient-to-br bg-clip-text dark:from-cyan-500  dark:via-40%',
							' from-secondary-600  to-primary-600',
							' font-bold text-transparent drop-shadow-sm',
							' !leading-normal md:text-2xl ',
						)}>
						<Link href={'/'}>
							<img
								alt={'logo'}
								src={'/housing-sky-logo-big-side-text.svg'}
								className={' max-w-[10rem] '}
							/>
						</Link>
					</h1>
				</div>
				<div className={'mx-2'}></div>
				<div className={'flex flex-row items-center gap-1 '}>
					{data?.user.id ? (
						data?.user?.role === 'HOTEL_MANAGER' ? (
							<HotelManagerMenuBar />
						) : (
							<GuestMenuBar />
						)
					) : (
						<DefaultMenuBar />
					)}
				</div>
				<div className={'ml-auto flex w-fit flex-row gap-2 '}>
					{data?.user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant={'ghost'}
									size={'lg'}
									className={'!gap-1 rounded-full !px-2 !py-6'}>
									<Avatar className={' aspect-square h-auto w-10 '}>
										<AvatarImage
											src={getPublicImageUrlFromPath(data.user.id)}
										/>
										<AvatarFallback
											className={'bg-primary/30  text-neutral-600'}>
											{data.user.name?.replaceAll(/(\w)\w+\s*/g, '$1')}
										</AvatarFallback>
									</Avatar>
									{data?.user.name}
									<ChevronDown width={28} height={28} />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent>
								<DropdownMenuItem asChild>
									<Link href={routes.UserProfile.generatePath()}>
										<LucideUserCog /> User Profile
									</Link>
								</DropdownMenuItem>
								{data.user.role === 'HOTEL_MANAGER' && (
									<DropdownMenuItem asChild>
										<Link href={routes.ManageHotelDetails.generatePath()}>
											<Settings /> Hotel Profile
										</Link>
									</DropdownMenuItem>
								)}

								<DropdownMenuSeparator />

								<DropdownMenuItem color="red" onClick={handleLogout}>
									<LogOut /> Log Out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<div className={'grid grid-cols-1 md:grid-cols-2 gap-2'}>
						<Button
							className={'rounded-full'}
							variant={'outline'} asChild>
							<Link href={routes.HotelRegistration.generatePath()}>Join Our Hotels</Link>
						</Button>
						<Button
							className={'rounded-full'}
							variant={'outline'}
							onClick={() => signIn()}>
							Sign In <ArrowRight />
						</Button>
						</div>
					)}
				</div>
			</nav>
			<main
				className={cn(
					'mx-auto h-full w-full max-w-screen-xl px-0 py-10 sm:px-[5rem] xl:px-5 2xl:px-0',
					classes?.main,
				)}>
				{roleGuard && (status === 'unauthenticated' || status === 'loading') ? (
					<div className={'grid place-items-center'}>
						<CircularProgress />
					</div>
				) : (
					children
				)}
			</main>
		</div>
	);
};

export default Layout;

