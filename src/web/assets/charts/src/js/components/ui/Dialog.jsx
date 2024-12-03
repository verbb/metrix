import { forwardRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = forwardRef(({ className, ...props }, ref) => {
    return (
        <DialogPrimitive.Overlay
            ref={ref}
            className={cn(
                // Reset
                'mc-fixed mc-inset-0 mc-z-[100]',

                // Theme
                'mc-bg-[#7b879359]',

                // State
                'data-[state=open]:mc-animate-in data-[state=closed]:mc-animate-out',
                'data-[state=closed]:mc-fade-out-0 data-[state=open]:mc-fade-in-0',

                className,
            )}
            {...props}
        />
    );
});
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = forwardRef(({ className, children, ...props }, ref) => {
    return (
        <DialogPortal>
            <div className="metrix-ui">
                <DialogOverlay />
                <DialogPrimitive.Content
                    ref={ref}
                    className={cn(
                        // Reset
                        'mc-fixed mc-left-[50%] mc-top-[50%] mc-z-[110] mc-grid mc-w-full mc-max-w-3xl',

                        // Theme
                        'mc-border mc-bg-white mc-rounded-lg mc-shadow-lg focus:mc-shadow-lg',

                        // Transform
                        'mc-translate-x-[-50%] mc-translate-y-[-50%]',

                        // State Animations
                        'data-[state=open]:mc-animate-in data-[state=closed]:mc-animate-out',
                        'data-[state=closed]:mc-fade-out-0 data-[state=open]:mc-fade-in-0',
                        'data-[state=closed]:mc-zoom-out-95 data-[state=open]:mc-zoom-in-95',
                        'data-[state=closed]:mc-slide-out-to-left-1/2 data-[state=closed]:mc-slide-out-to-top-[48%]',
                        'data-[state=open]:mc-slide-in-from-left-1/2 data-[state=open]:mc-slide-in-from-top-[48%]',

                        className,
                    )}
                    {...props}
                >
                    {children}
                    <DialogPrimitive.Close
                        className={cn(
                            // Reset
                            'mc-absolute mc-right-4 mc-top-4 mc-rounded-sm',

                            // Theme
                            'mc-opacity-70 mc-ring-offset-background mc-transition-opacity',

                            // State
                            'hover:mc-opacity-100 focus:mc-outline-none focus:mc-ring-2 focus:mc-ring-ring focus:mc-ring-offset-2 disabled:mc-pointer-events-none',
                            'data-[state=open]:mc-bg-blue-500 data-[state=open]:mc-text-slate-500',
                        )}
                    >
                        <X className="mc-h-4 mc-w-4" />
                        <span className="mc-sr-only">Close</span>
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </div>
        </DialogPortal>
    );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }) => {
    return (
        <div
            className={cn(
                // Reset
                'mc-flex mc-flex-col mc-space-y-1.5',
                'mc-text-left',
                'sm:mc-rounded-t-lg',

                // Theme
                'mc-bg-slate-100 mc-p-4 mc-border-b',

                className,
            )}
            {...props}
        />
    );
};
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }) => {
    return (
        <div
            className={cn(
                // Reset
                'mc-flex mc-flex-row mc-justify-end',
                'sm:mc-rounded-b-lg',

                // Theme
                'mc-bg-slate-100 mc-py-2 mc-px-4 mc-border-t',

                className,
            )}
            {...props}
        />
    );
};
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = forwardRef(({ className, ...props }, ref) => {
    return (
        <DialogPrimitive.Title
            ref={ref}
            className={cn(
                // Reset
                'mc-text-base mc-font-semibold mc-leading-none',

                className,
            )}
            {...props}
        />
    );
});
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = forwardRef(({ className, ...props }, ref) => {
    return (
        <DialogPrimitive.Description
            ref={ref}
            className={cn(
                // Reset
                'mc-text-sm',

                className,
            )}
            {...props}
        />
    );
});
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
};
