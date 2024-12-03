import { forwardRef } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';

import { cn } from '@utils';

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = forwardRef(({
    className, inset, children, ...props
}, ref) => {
    return (
        <DropdownMenuPrimitive.SubTrigger
            ref={ref}
            className={cn(
                'mc-flex mc-gap-2 mc-items-center mc-rounded-sm',
                'mc-cursor-default mc-select-none mc-px-2 mc-py-1.5',
                'mc-text-sm mc-outline-none mc-transition-colors',
                'mc-focus:bg-slate-100 data-[state=open]:bg-slate-100',
                '[&_svg]:mc-pointer-events-none [&_svg]:mc-size-4 [&_svg]:mc-shrink-0',
                inset && 'mc-pl-8',
                className,
            )}
            {...props}
        >
            {children}
            <ChevronRight className="mc-ml-auto" />
        </DropdownMenuPrimitive.SubTrigger>
    );
});
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = forwardRef(({ className, ...props }, ref) => {
    return (
        <DropdownMenuPrimitive.SubContent
            ref={ref}
            className={cn(
                'mc-z-50 mc-min-w-[8rem] mc-overflow-hidden mc-rounded-md mc-border',
                'mc-bg-white mc-text-slate-600 mc-shadow-lg',
                'mc-p-1 data-[state=open]:mc-animate-in data-[state=closed]:mc-animate-out',
                'data-[state=open]:mc-fade-in-0 data-[state=closed]:mc-fade-out-0',
                'data-[state=open]:mc-zoom-in-95 data-[state=closed]:mc-zoom-out-95',
                'data-[side=bottom]:mc-slide-in-from-top-2 data-[side=left]:mc-slide-in-from-right-2',
                'data-[side=right]:mc-slide-in-from-left-2 data-[side=top]:mc-slide-in-from-bottom-2',
                className,
            )}
            {...props}
        />
    );
});
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = forwardRef(({ className, sideOffset = 4, ...props }, ref) => {
    return (
        <DropdownMenuPrimitive.Portal>
            <div className="metrix-ui">
                <DropdownMenuPrimitive.Content
                    ref={ref}
                    sideOffset={sideOffset}
                    className={cn(
                        'mc-z-50 mc-min-w-[8rem] mc-overflow-hidden mc-rounded-sm mc-border',
                        'mc-bg-white mc-text-slate-600 mc-shadow-md focus:mc-shadow-md',
                        'mc-p-1 data-[state=open]:mc-animate-in data-[state=closed]:mc-animate-out',
                        'data-[state=open]:mc-fade-in-0 data-[state=closed]:mc-fade-out-0',
                        'data-[state=open]:mc-zoom-in-95 data-[state=closed]:mc-zoom-out-95',
                        'data-[side=bottom]:mc-slide-in-from-top-2 data-[side=left]:mc-slide-in-from-right-2',
                        'data-[side=right]:mc-slide-in-from-left-2 data-[side=top]:mc-slide-in-from-bottom-2',
                        className,
                    )}
                    {...props}
                />
            </div>
        </DropdownMenuPrimitive.Portal>
    );
});
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = forwardRef(({ className, inset, ...props }, ref) => {
    return (
        <DropdownMenuPrimitive.Item
            ref={ref}
            className={cn(
                'mc-relative mc-flex mc-items-center mc-gap-2 mc-rounded-sm',
                'mc-cursor-default mc-select-none mc-px-2 mc-py-1.5',
                'mc-text-sm mc-outline-none mc-transition-colors',
                'mc-shadow-none',
                'focus:mc-bg-slate-100',
                'data-[disabled]:mc-pointer-events-none data-[disabled]:mc-opacity-50',
                '[&_svg]:mc-pointer-events-none [&_svg]:mc-size-4 [&_svg]:mc-shrink-0',
                inset && 'mc-pl-8',
                className,
            )}
            {...props}
        />
    );
});
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = forwardRef(({
    className, children, checked, ...props
}, ref) => {
    return (
        <DropdownMenuPrimitive.CheckboxItem
            ref={ref}
            className={cn(
                'mc-relative mc-flex mc-items-center mc-rounded-sm',
                'mc-cursor-default mc-select-none mc-py-1.5 mc-pl-8 mc-pr-2',
                'mc-text-sm mc-outline-none mc-transition-colors',
                'focus:mc-bg-slate-100',
                'data-[disabled]:mc-pointer-events-none data-[disabled]:mc-opacity-50',
                className,
            )}
            checked={checked}
            {...props}
        >
            <span className="mc-absolute mc-left-2 mc-flex mc-h-3.5 mc-w-3.5 mc-items-center mc-justify-center">
                <DropdownMenuPrimitive.ItemIndicator>
                    <Check className="mc-h-4 mc-w-4" />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.CheckboxItem>
    );
});
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = forwardRef(({ className, children, ...props }, ref) => {
    return (
        <DropdownMenuPrimitive.RadioItem
            ref={ref}
            className={cn(
                'mc-relative mc-flex mc-items-center mc-rounded-sm',
                'mc-cursor-default mc-select-none mc-py-1.5 mc-pl-8 mc-pr-2',
                'mc-text-sm mc-outline-none mc-transition-colors',
                'focus:mc-bg-slate-100',
                'data-[disabled]:mc-pointer-events-none data-[disabled]:mc-opacity-50',
                className,
            )}
            {...props}
        >
            <span className="mc-absolute mc-left-2 mc-flex mc-h-3.5 mc-w-3.5 mc-items-center mc-justify-center">
                <DropdownMenuPrimitive.ItemIndicator>
                    <Circle className="mc-size-2 mc-fill-current" />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.RadioItem>
    );
});
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = forwardRef(({ className, inset, ...props }, ref) => {
    return (
        <DropdownMenuPrimitive.Label
            ref={ref}
            className={cn(
                'mc-px-2 mc-py-1.5 mc-text-sm mc-font-semibold',
                inset && 'mc-pl-8',
                className,
            )}
            {...props}
        />
    );
});
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = forwardRef(({ className, ...props }, ref) => {
    return (
        <DropdownMenuPrimitive.Separator
            ref={ref}
            className={cn('-mc-mx-1 mc-my-1 mc-h-px mc-bg-slate-200', className)}
            {...props}
        />
    );
});
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }) => {
    return (
        <span
            className={cn('mc-ml-auto mc-text-xs mc-tracking-widest mc-opacity-60', className)}
            {...props}
        />
    );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
};
