import { forwardRef } from 'react';

import { cn } from '@utils';

const Input = forwardRef(({ className, type = 'text', ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                // Reset
                'mc-flex mc-w-full mc-rounded-[3px] mc-border mc-border-slate-300',

                // Themes
                'mc-px-2 mc-py-1.5 mc-text-sm',

                // Hover & Focus
                'focus-visible:mc-outline-none focus-visible:mc-shadow-inputRing',
                'placeholder:mc-text-slate-500',

                // Data States
                'disabled:mc-cursor-not-allowed disabled:mc-opacity-50',

                // File
                'file:mc-border-0 file:mc-bg-transparent file:mc-text-sm file:mc-font-medium file:mc-text-foreground',

                // Custom Classes
                className,
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = 'Input';

export { Input };
