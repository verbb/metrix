import {forwardRef} from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(
    ({ className, ...props }, ref) => (
        <TabsPrimitive.List
            ref={ref}
            className={cn(
                // Reset and layout
                'mc-inline-flex mc-h-10 mc-items-center mc-justify-center mc-rounded-md mc-p-1',
                // Themes
                'mc-bg-slate-200 mc-text-slate-500',
                className
            )}
            {...props}
        />
    )
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = forwardRef(
    ({ className, ...props }, ref) => (
        <TabsPrimitive.Trigger
            ref={ref}
            className={cn(
                // Reset and layout
                'mc-inline-flex mc-items-center mc-justify-center mc-whitespace-nowrap mc-rounded-sm mc-px-3 mc-py-1.5 mc-text-sm mc-font-medium',
                // Transitions
                'mc-transition-all',
                // Accessibility
                'focus-visible:mc-outline-none focus-visible:mc-ring-2 focus-visible:mc-ring-ring focus-visible:mc-ring-offset-2',
                // Disabled state
                'disabled:mc-pointer-events-none disabled:mc-opacity-50',
                // Active state
                'data-[state=active]:mc-bg-background data-[state=active]:mc-text-foreground data-[state=active]:mc-shadow-sm',
                className
            )}
            {...props}
        />
    )
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef(
    ({ className, ...props }, ref) => (
        <TabsPrimitive.Content
            ref={ref}
            className={cn(
                // Reset and layout
                'mc-mt-2',
                // Accessibility
                'focus-visible:mc-outline-none focus-visible:mc-ring-2 focus-visible:mc-ring-ring focus-visible:mc-ring-offset-2',
                className
            )}
            {...props}
        />
    )
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };