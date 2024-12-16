import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '@utils';

const buttonVariants = cva('', {
    variants: {
        variant: {
            default: 'mc-bg-blue-500 mc-text-white hover:mc-bg-blue-500/90',
            primary: 'mc-bg-red-500 mc-text-white hover:mc-bg-red-500/90',
            secondary: 'mc-bg-[#c4d0e1] mc-text-slate-600 hover:mc-bg-[#becadc]',
            outline: 'mc-border mc-border-input mc-bg-transparent hover:bg-slate-100 hover:mc-text-slate-600',
            link: 'mc-text-blue-500 mc-underline-offset-4 hover:mc-underline',
            clear: 'hover:mc-bg-transparent',
            dashed: 'mc-border mc-border-dashed mc-border-slate-300 mc-text-xs mc-w-full [&_svg]:mc-size-3',
        },
        size: {
            default: 'mc-px-4 mc-py-2',
            tiny: 'mc-px-2 mc-py-0.5 mc-text-[12px] mc-rounded',
            small: 'mc-px-3 mc-py-1',
            medium: 'mc-px-5 mc-py-3',
            large: 'mc-px-8 mc-py-4',
            icon: 'mc-px-3 mc-py-2',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});

const Button = forwardRef(({
    className, variant, size, asChild = false, ...props
}, ref) => {
    const Component = asChild ? Slot : 'button';

    return (
        <Component
            className={cn(
                'mc-inline-flex mc-gap-1 mc-items-center mc-justify-center mc-whitespace-nowrap mc-ring-offset-background mc-transition-colors',
                'focus-visible:mc-outline-none focus-visible:mc-ring-2 focus-visible:mc-ring-ring focus-visible:mc-ring-offset-2',
                'disabled:mc-pointer-events-none disabled:mc-opacity-50 [&_svg]:mc-pointer-events-none [&_svg]:mc-size-4 [&_svg]:mc-shrink-0',
                'mc-rounded-md mc-text-sm',
                'hover:mc-bg-slate-100',
                buttonVariants({ variant, size, className }),
            )}
            ref={ref}
            {...props}
        />
    );
});

Button.displayName = 'Button';

export { Button };
