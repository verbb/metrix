import { forwardRef } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = forwardRef(({
    className, iconClassName, children, ...props
}, ref) => {
    return (
        <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
                'mc-flex mc-items-center mc-justify-between',
                'mc-rounded-[5px] mc-ring-offset-background',
                'mc-gap-1',
                'mc-px-2.5 mc-py-1.5 mc-text-sm',
                'mc-bg-slate-200',
                'hover:mc-shadow-inputRing',
                'placeholder:mc-text-slate-500 focus:mc-outline-none focus:mc-shadow-inputRing',
                'disabled:mc-cursor-not-allowed disabled:mc-opacity-50 [&>span]:mc-line-clamp-1',
                className,
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDown className={cn(
                    'mc-size-4 mc-ml-4 -mc-mr-1',
                    iconClassName,
                )} />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
});

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = forwardRef(({ className, ...props }, ref) => {
    return (
        <SelectPrimitive.ScrollUpButton
            ref={ref}
            className={cn(
                'mc-flex mc-cursor-default mc-items-center mc-justify-center mc-py-1',
                className,
            )}
            {...props}
        >
            <ChevronUp className="mc-size-4" />
        </SelectPrimitive.ScrollUpButton>
    );
});

SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = forwardRef(({ className, ...props }, ref) => {
    return (
        <SelectPrimitive.ScrollDownButton
            ref={ref}
            className={cn(
                'mc-flex mc-cursor-default mc-items-center mc-justify-center mc-py-1',
                className,
            )}
            {...props}
        >
            <ChevronDown className="mc-size-4" />
        </SelectPrimitive.ScrollDownButton>
    );
});

SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = forwardRef(({
    className,
    children,
    position = 'popper',
    ...props
}, ref) => {
    const $portalContainer = document.querySelector('.metrix-portal-container');

    return (
        <SelectPrimitive.Portal container={$portalContainer}>
            <SelectPrimitive.Content
                ref={ref}
                className={cn(
                    'mc-relative mc-z-50 mc-overflow-hidden mc-rounded mc-border mc-shadow-md focus:mc-shadow-md',
                    'mc-max-h-[20rem] mc-min-w-[8rem]',
                    'mc-bg-white',
                    'data-[state=open]:mc-animate-in data-[state=closed]:mc-animate-out data-[state=closed]:mc-fade-out-0 data-[state=open]:mc-fade-in-0 data-[state=closed]:mc-zoom-out-95 data-[state=open]:mc-zoom-in-95 data-[side=bottom]:mc-slide-in-from-top-2 data-[side=left]:mc-slide-in-from-right-2 data-[side=right]:mc-slide-in-from-left-2 data-[side=top]:mc-slide-in-from-bottom-2',
                    position === 'popper' && 'data-[side=bottom]:mc-translate-y-1 data-[side=left]:-mc-translate-x-1 data-[side=right]:mc-translate-x-1 data-[side=top]:-mc-translate-y-1',
                    className,
                )}
                position={position}
                {...props}
            >
                <SelectPrimitive.Viewport
                    className={cn(
                        'mc-p-1',
                        position === 'popper' && 'mc-h-[var(--radix-select-trigger-height)] mc-w-full mc-min-w-[var(--radix-select-trigger-width)]',
                    )}
                >
                    {children}
                </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
});

SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = forwardRef(({ className, ...props }, ref) => {
    return (
        <SelectPrimitive.Label
            ref={ref}
            className={cn('mc-py-1.5 mc-pl-8 mc-pr-2 mc-text-xs mc-font-semibold', className)}
            {...props}
        />
    );
});

SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = forwardRef(({ className, children, ...props }, ref) => {
    return (
        <SelectPrimitive.Item
            ref={ref}
            className={cn(
                'mc-relative mc-flex mc-w-full mc-cursor-default mc-select-none mc-items-center mc-rounded-sm mc-outline-none mc-shadow-none',
                'mc-py-1.5 mc-pl-8 mc-pr-2 mc-text-xs',
                'focus:mc-bg-slate-200 data-[disabled]:mc-pointer-events-none data-[disabled]:mc-opacity-50',
                className,
            )}
            {...props}
        >
            <span className="mc-absolute mc-left-2 mc-flex mc-h-3.5 mc-w-3.5 mc-items-center mc-justify-center">
                <SelectPrimitive.ItemIndicator>
                    <Check className="mc-h-4 mc-w-4" />
                </SelectPrimitive.ItemIndicator>
            </span>

            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    );
});

SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = forwardRef(({ className, ...props }, ref) => {
    return (
        <SelectPrimitive.Separator
            ref={ref}
            className={cn('-mc-mx-1 mc-my-1 mc-h-px mc-bg-slate-200', className)}
            {...props}
        />
    );
});

SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
};
