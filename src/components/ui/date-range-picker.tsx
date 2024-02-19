'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { AlertTriangleIcon, Calendar as CalendarIcon } from 'lucide-react';
import { DateRange, Matcher } from 'react-day-picker';

import { cn } from '~/utils';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { toast } from 'sonner';
import { checkIfDateRangeOverlapsMatchers } from '~/utils/dates';

export function DatePickerWithRange({
	date,
	onDatesChanged,
	disabled,
	className,
}: React.HTMLAttributes<HTMLDivElement> & {
	date?: DateRange;
	disabled?: Matcher[];
	onDatesChanged?: (dateRange?: DateRange) => void;
}) {
	return (
		<div className={cn('grid gap-2', className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={'outline'}
						className={cn(
							'w-[300px] justify-start text-left font-normal',
							!date && 'text-muted-foreground',
						)}>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'LLL dd, y')} -{' '}
									{format(date.to, 'LLL dd, y')}
								</>
							) : (
								format(date.from, 'LLL dd, y')
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						initialFocus
						mode="range"
						disabled={disabled}
						defaultMonth={date?.from}
						selected={date}
						onSelect={(range, selectedDay, activeModifiers, e) => {
							if (
								disabled &&
								range &&
								checkIfDateRangeOverlapsMatchers(disabled, range)
							) {
								toast(
									<>
										{' '}
										<AlertTriangleIcon
											className={'text-red-500'}
											strokeWidth={2}
											size={28}
										/>{' '}
										Please Select Continuous Range
									</>,
								);
							} else onDatesChanged?.(range);
						}}
						numberOfMonths={2}
					/>
					<div className={'p-3'}>
						<Button
							onClick={() => onDatesChanged?.({ from: undefined, to: undefined })}
							variant={'ghost'}>
							{' '}
							Reset{' '}
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

