import { forwardRef } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';

import { Dialog, DialogContent } from '@components/ui/Dialog';

import { cn } from '@utils';

const Command = forwardRef(({ className, ...props }, ref) => {
    return (
        <CommandPrimitive
            ref={ref}
            className={cn(
                // Layout
                'mc-flex mc-h-full mc-w-full mc-flex-col',

                // Appearance
                'mc-rounded mc-shadow-md focus:mc-shadow-md',

                className,
            )}
            {...props}
        />
    );
});
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }) => {
    return (
        <Dialog {...props}>
            <DialogContent className="mc-p-0 mc-shadow-lg">
                <Command className={cn(
                    // Layout
                    '[&_[cmdk-group-heading]]:mc-px-2 [&_[cmdk-group]]:mc-px-2 [&_[cmdk-input-wrapper]_svg]:mc-h-5 [&_[cmdk-input-wrapper]_svg]:mc-w-5',

                    // Appearance
                    '[&_[cmdk-group-heading]]:mc-font-medium',
                    '[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:mc-pt-0 [&_[cmdk-input]]:mc-h-12 [&_[cmdk-item]]:mc-px-2 [&_[cmdk-item]]:mc-py-3 [&_[cmdk-item]_svg]:mc-h-5 [&_[cmdk-item]_svg]:mc-w-5',
                )}>
                    {children}
                </Command>
            </DialogContent>
        </Dialog>
    );
};

const CommandInput = forwardRef(({ className, ...props }, ref) => {
    return (
        <div
            className="mc-flex mc-items-center mc-border-b mc-px-3"
            // eslint-disable-next-line
            cmdk-input-wrapper=""
        >
            <Search className="mc-mr-2 mc-size-3 mc-shrink-0 mc-opacity-50" />

            <CommandPrimitive.Input
                ref={ref}
                className={cn(
                    // Layout
                    'mc-flex mc-w-full mc-py-2.5',

                    // Appearance
                    'mc-rounded-md mc-text-xs',

                    // State
                    'mc-shadow-none mc-outline-none mc-disabled:mc-cursor-not-allowed mc-disabled:mc-opacity-50',
                    className,
                )}
                {...props}
            />
        </div>
    );
});

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = forwardRef(({ className, ...props }, ref) => {
    return (
        <CommandPrimitive.List
            ref={ref}
            className={cn(
                // Layout
                'mc-max-h-[300px] mc-overflow-y-auto',

                // Appearance
                // 'mc-text-xs',

                className,
            )}
            {...props}
        />
    );
});

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = forwardRef((props, ref) => {
    return (
        <CommandPrimitive.Empty
            ref={ref}
            className={cn(
                // Layout
                'mc-pt-4 mc-pb-3 mc-text-center',

                // Appearance
                'mc-text-xs',
            )}
            {...props}
        />
    );
});

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = forwardRef(({ className, ...props }, ref) => {
    return (
        <CommandPrimitive.Group
            ref={ref}
            className={cn(
                // Layout
                'mc-p-1',

                // Appearance
                '[&_[cmdk-group-heading]]:mc-px-2 [&_[cmdk-group-heading]]:mc-py-1.5 [&_[cmdk-group-heading]]:mc-text-xs [&_[cmdk-group-heading]]:mc-font-medium',
                className,
            )}
            {...props}
        />
    );
});

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = forwardRef(({ className, ...props }, ref) => {
    return (
        <CommandPrimitive.Separator
            ref={ref}
            className={cn(
                // Layout
                'mc--mx-1 mc-h-px',
                // Appearance
                'mc-bg-border',
                className,
            )}
            {...props}
        />
    );
});

CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = forwardRef(({ className, ...props }, ref) => {
    return (
        <CommandPrimitive.Item
            ref={ref}
            className={cn(
                // Layout
                'mc-relative mc-flex mc-gap-2 mc-items-center mc-px-2 mc-py-1.5',

                // Appearance
                'mc-text-xs mc-rounded-sm',

                // State
                'mc-cursor-default mc-select-none mc-outline-none data-[disabled=true]:mc-pointer-events-none data-[selected=true]:mc-bg-slate-200 data-[disabled=true]:mc-opacity-50',
                '[&_svg]:mc-pointer-events-none [&_svg]:mc-size-4 [&_svg]:mc-shrink-0',
                className,
            )}
            {...props}
        />
    );
});

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }) => {
    return (
        <span
            className={cn(
                // Layout
                'mc-ml-auto',

                // Appearance
                'mc-text-xs mc-tracking-widest',
                className,
            )}
            {...props}
        />
    );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
};
