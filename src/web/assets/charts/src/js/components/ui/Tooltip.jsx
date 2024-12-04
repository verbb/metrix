import { forwardRef } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@utils';

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = forwardRef(
    ({ className, sideOffset = 4, ...props }, ref) => {
        return (
            <TooltipPrimitive.Content
                ref={ref}
                sideOffset={sideOffset}
                className={cn(
                // Position and layout
                    'mc-z-50 mc-overflow-hidden mc-rounded-md mc-px-3 mc-py-1.5',
                    // Borders and backgrounds
                    'mc-border mc-bg-popover mc-text-popover-foreground',
                    // Text and size
                    'mc-text-sm',
                    // Shadows
                    'mc-shadow-md',
                    // Animations
                    'mc-animate-in mc-fade-in-0 mc-zoom-in-95',
                    'data-[state=closed]:mc-animate-out data-[state=closed]:mc-fade-out-0 data-[state=closed]:mc-zoom-out-95',
                    'data-[side=bottom]:mc-slide-in-from-top-2',
                    'data-[side=left]:mc-slide-in-from-right-2',
                    'data-[side=right]:mc-slide-in-from-left-2',
                    'data-[side=top]:mc-slide-in-from-bottom-2',
                    className,
                )}
                {...props}
            />
        );
    },
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
    Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
};
