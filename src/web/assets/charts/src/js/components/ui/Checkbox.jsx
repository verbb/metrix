import { forwardRef } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@utils';

const Checkbox = forwardRef(({ className, ...props }, ref) => {
    return (
        <CheckboxPrimitive.Root
            ref={ref}
            className={cn(
            // Reset
                'mc-peer mc-h-4 mc-w-4 mc-shrink-0 mc-rounded-sm mc-border',

                // Themes
                'mc-border-primary mc-ring-offset-background',

                // States
                'mc-focus-visible:outline-none mc-focus-visible:ring-2 mc-focus-visible:ring-ring mc-focus-visible:ring-offset-2',
                'mc-disabled:cursor-not-allowed mc-disabled:opacity-50',
                'mc-data-[state=checked]:bg-primary mc-data-[state=checked]:text-primary-foreground',

                // Custom
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                className={cn(
                // Reset
                    'mc-flex mc-items-center mc-justify-center',

                    // Themes
                    'mc-text-current',
                )}
            >
                <Check className="mc-h-4 mc-w-4" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
