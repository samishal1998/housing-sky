import Link from 'next/link';
import Layout from '~/components/layouts/layout';
import { routes } from '~/routes/router';
import { cn } from '~/utils';
import { ArrowRight } from 'lucide-react';

export default function Home() {
	return (
		<>
			<Layout
				classes={{
					main: cn(
						' mb-auto mt-10 relative h-[clamp(600px,calc(100vh-5rem),1000px)] text-center flex flex-col justify-center items-center snap-start snap-always rounded-3xl mx-4 lg:mx-12 lg:w-[calc(100%-6rem)] w-[calc(100%-2rem)] max-w-full',
						' bg-gradient-to-br',
						'from-amber-200 via-amber-200 to-rose-200 dark:from-amber-900 dark:via-amber-800 dark:to-rose-600',
					),
				}}>
				<h1
					className={cn(
						'font-display  text-center text-4xl',
						' bg-gradient-to-br bg-clip-text dark:from-cyan-500 dark:via-amber-300 dark:via-40%  dark:to-amber-600',
						' from-rose-600  to-amber-600',
						' font-bold text-transparent drop-shadow-sm',
						' !leading-normal md:text-8xl ',
					)}>
					Housing Sky
				</h1>
				<h5 className={'py-3 text-xl font-semibold text-neutral-600 dark:text-white'}>
					Fast & Accessible Hotel Booking
				</h5>

				<Link
					href={routes.RoomsGallery.generatePath()}
					className={cn(
						'gradient-button cursor-pointer rounded-2xl bg-gradient-to-br px-6 py-2 text-center text-xl font-semibold text-white shadow',
					)}>
					Get Started{' '}
					<ArrowRight className={'inline'} height={24} width={24} strokeWidth={3} />
				</Link>
			</Layout>
		</>
	);
}