import { forwardRef } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '@utils';

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = forwardRef(({
    className,
    align = 'center',
    sideOffset = 4,
    children,
    ...props
}, ref) => {
    return (
        <PopoverPrimitive.Portal>
            <div className="metrix-ui">
                <PopoverPrimitive.Content
                    ref={ref}
                    align={align}
                    sideOffset={sideOffset}
                    className={cn(
                        // Reset and base styles
                        'mc-z-50 mc-w-72 mc-rounded-md mc-outline-none mc-will-change-[transform,opacity]',

                        // Themed styles (backgrounds, colors, shadows, spacing)
                        'mc-bg-white mc-p-4',
                        'mc-shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)]',
                        'focus:mc-shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)]',

                        // Animation classes for open/closed states
                        'data-[state=open]:mc-animate-in data-[state=closed]:mc-animate-out',
                        'data-[state=closed]:mc-fade-out-0 data-[state=open]:mc-fade-in-0',
                        'data-[state=closed]:mc-zoom-out-95 data-[state=open]:mc-zoom-in-95',

                        // Animation classes for side-based slide-ins
                        'data-[side=bottom]:mc-slide-in-from-top-2',
                        'data-[side=left]:mc-slide-in-from-right-2',
                        'data-[side=right]:mc-slide-in-from-left-2',
                        'data-[side=top]:mc-slide-in-from-bottom-2',

                        // Additional custom classes passed in as props
                        className,
                    )}
                    {...props}
                >
                    {children}

                    <PopoverPrimitive.Arrow
                        className="mc-fill-white"
                    />
                </PopoverPrimitive.Content>
            </div>
        </PopoverPrimitive.Portal>
    );
});

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
