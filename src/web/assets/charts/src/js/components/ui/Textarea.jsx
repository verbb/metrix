import {forwardRef} from 'react';

import { cn } from '@utils';

const Textarea = forwardRef(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                // Reset and layout
                'mc-flex mc-min-h-[80px] mc-w-full mc-rounded-md mc-px-3 mc-py-2',
                // Borders and backgrounds
                'mc-border mc-border-input mc-bg-background',
                // Text
                'mc-text-base mc-placeholder:text-slate-500',
                // Accessibility and focus
                'focus-visible:mc-outline-none focus-visible:mc-ring-2 focus-visible:mc-ring-ring focus-visible:mc-ring-offset-2',
                // Disabled state
                'disabled:mc-cursor-not-allowed disabled:mc-opacity-50',
                // Media queries
                'md:mc-text-sm',
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = 'Textarea';

export { Textarea };