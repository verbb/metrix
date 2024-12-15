import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { buttonVariants } from '@components/ui/Button';

import { cn } from '@utils';

export function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn(
                // Padding and outer styling
                'mc-p-3',
                className
            )}
            classNames={{
                months: cn(
                    // Month grid layout
                    'mc-flex mc-flex-col sm:mc-flex-row mc-space-y-4 sm:mc-space-x-4 sm:mc-space-y-0',
                    classNames?.months
                ),
                month: 'mc-space-y-4',
                caption: 'mc-flex mc-justify-center mc-pt-1 mc-relative mc-items-center',
                caption_label: 'mc-text-sm mc-font-medium',
                nav: 'mc-space-x-1 mc-flex mc-items-center',
                nav_button: cn(
                    buttonVariants({ variant: 'outline' }),
                    // Navigation button styles
                    'mc-h-7 mc-w-7 mc-bg-transparent mc-p-0 mc-opacity-50 hover:mc-opacity-100',
                    classNames?.nav_button
                ),
                nav_button_previous: 'mc-absolute mc-left-1',
                nav_button_next: 'mc-absolute mc-right-1',
                table: 'mc-w-full mc-border-collapse mc-space-y-1',
                head_row: 'mc-flex',
                head_cell: cn(
                    // Header cell styling
                    'mc-text-slate-500 mc-rounded-md mc-w-9 mc-font-normal mc-text-[0.8rem]',
                    classNames?.head_cell
                ),
                row: 'mc-flex mc-w-full mc-mt-2',
                cell: cn(
                    // Cell styles for different states
                    'mc-h-9 mc-w-9 mc-text-center mc-text-sm mc-p-0 mc-relative',
                    '[&:has([aria-selected].day-range-end)]:mc-rounded-r-md',
                    '[&:has([aria-selected].day-outside)]:mc-bg-accent/50',
                    '[&:has([aria-selected])]:mc-bg-accent',
                    'first:[&:has([aria-selected])]:mc-rounded-l-md',
                    'last:[&:has([aria-selected])]:mc-rounded-r-md',
                    'focus-within:mc-relative focus-within:mc-z-20',
                    classNames?.cell
                ),
                day: cn(
                    buttonVariants({ variant: 'ghost' }),
                    // Day styles
                    'mc-h-9 mc-w-9 mc-p-0 mc-font-normal aria-selected:mc-opacity-100',
                    classNames?.day
                ),
                day_range_end: 'mc-day-range-end',
                day_selected: cn(
                    // Selected day styles
                    'mc-bg-primary mc-text-primary-foreground hover:mc-bg-primary hover:mc-text-primary-foreground focus:mc-bg-primary focus:mc-text-primary-foreground',
                    classNames?.day_selected
                ),
                day_today: 'mc-bg-accent mc-text-accent-foreground',
                day_outside: cn(
                    // Outside days styling
                    'mc-day-outside mc-text-slate-500',
                    'aria-selected:mc-bg-accent/50 aria-selected:mc-text-slate-500',
                    classNames?.day_outside
                ),
                day_disabled: 'mc-text-slate-500 mc-opacity-50',
                day_range_middle: cn(
                    // Middle day range styling
                    'aria-selected:mc-bg-accent aria-selected:mc-text-accent-foreground',
                    classNames?.day_range_middle
                ),
                day_hidden: 'mc-invisible',
                ...classNames,
            }}
            components={{
                IconLeft: (props) => (
                    <ChevronLeft
                        className={cn(
                            // Left chevron icon
                            'mc-h-4 mc-w-4',
                            props?.className
                        )}
                        {...props}
                    />
                ),
                IconRight: (props) => (
                    <ChevronRight
                        className={cn(
                            // Right chevron icon
                            'mc-h-4 mc-w-4',
                            props?.className
                        )}
                        {...props}
                    />
                ),
            }}
            {...props}
        />
    );
}

Calendar.displayName = 'Calendar';