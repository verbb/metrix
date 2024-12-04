import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@components/ui/Button';
import { Calendar } from '@components/ui/Calendar';

import { cn } from '@utils';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@components/ui/Popover';

export function DatePickerDemo() {
    const [date, setDate] = useState();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        // Width and alignment
                        'mc-w-[280px] mc-justify-start mc-text-left mc-font-normal',
                        // Placeholder styling
                        !date && 'mc-text-slate-500',
                    )}
                >
                    <CalendarIcon
                        className={cn(
                            // Icon size and margin
                            'mc-mr-2 mc-h-4 mc-w-4',
                        )}
                    />
                    {date ? (
                        format(date, 'PPP')
                    ) : (
                        <span>Pick a date</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={cn(
                    // Popover width and padding
                    'mc-w-auto mc-p-0',
                )}
            >
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
