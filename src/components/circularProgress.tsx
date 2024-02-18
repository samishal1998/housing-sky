import { LoaderIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export type CircularProgressProps = {
	width?: string | number | undefined;
	height?: string | number | undefined;
	color?: string | undefined;
	className?: string | undefined;
};
export function CircularProgress({ width = 36, height = 36, className }: CircularProgressProps) {
	return (
		<LoaderIcon
			className={twMerge('animate-spin dark:text-primary-300 text-primary-600', className)}
			width={width}
			height={height}
		/>
	);
}
