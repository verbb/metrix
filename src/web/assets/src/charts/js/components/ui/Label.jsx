import { forwardRef } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';

import { cn } from '@utils';

const labelVariants = cva(
    // Reset and themes
    'mc-text-sm mc-font-medium mc-leading-none',
    // States
    'peer-disabled:mc-cursor-not-allowed peer-disabled:mc-opacity-70',
);

const Label = forwardRef(({ className, ...props }, ref) => {
    return (
        <LabelPrimitive.Root
            ref={ref}
            className={cn(labelVariants(), className)}
            {...props}
        />
    );
});

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
