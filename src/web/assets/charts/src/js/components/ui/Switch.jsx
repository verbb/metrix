import {forwardRef} from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@utils';

const Switch = forwardRef(
    (
        {
            className,
            ...props
        },
        ref
    ) => (
        <SwitchPrimitives.Root
            ref={ref}
            className={cn(
                // Reset and layout
                'mc-peer mc-inline-flex mc-h-6 mc-w-11 mc-shrink-0 mc-items-center mc-rounded-full mc-cursor-pointer',
                // State and themes
                'mc-border-2 mc-border-transparent mc-transition-colors',
                'data-[state=checked]:mc-bg-primary',
                'data-[state=unchecked]:mc-bg-input',
                // Focus and accessibility
                'focus-visible:mc-outline-none focus-visible:mc-ring-2 focus-visible:mc-ring-ring focus-visible:mc-ring-offset-2 focus-visible:mc-ring-offset-background',
                // Disabled styles
                'disabled:mc-cursor-not-allowed disabled:mc-opacity-50',
                className
            )}
            {...props}
        >
            <SwitchPrimitives.Thumb
                className={cn(
                    // Reset and layout
                    'mc-pointer-events-none mc-block mc-h-5 mc-w-5 mc-rounded-full',
                    // Themes
                    'mc-bg-background mc-shadow-lg mc-ring-0',
                    // Transitions and state changes
                    'mc-transition-transform data-[state=checked]:mc-translate-x-5 data-[state=unchecked]:mc-translate-x-0'
                )}
            />
        </SwitchPrimitives.Root>
    )
);

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };