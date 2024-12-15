import {forwardRef} from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';

import { cn } from '@utils';

const RadioGroup = forwardRef(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Root
            ref={ref}
            className={cn(
                // Layout and spacing
                'mc-grid mc-gap-2',
                className
            )}
            {...props}
        />
    );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = forwardRef(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(
                // Layout, shape, and borders
                'mc-aspect-square mc-h-4 mc-w-4 mc-rounded-full mc-border mc-border-primary',
                // Text and focus styles
                'mc-text-primary mc-ring-offset-background mc-focus:outline-none mc-focus-visible:ring-2 mc-focus-visible:ring-ring mc-focus-visible:ring-offset-2',
                // Disabled state
                'mc-disabled:cursor-not-allowed mc-disabled:opacity-50',
                className
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator
                className={cn(
                    // Flex alignment for the indicator
                    'mc-flex mc-items-center mc-justify-center'
                )}
            >
                <Circle
                    className={cn(
                        // Size and color of the indicator
                        'mc-h-2.5 mc-w-2.5 mc-fill-current mc-text-current'
                    )}
                />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };