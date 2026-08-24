import { motion } from 'framer-motion';

import { Widget } from '@dashboard/components/widgets/Widget';

import { cn } from '@utils';

export const WidgetLarge = ({ className, wrapperClassName, ...props }) => {
    return (
        <motion.div
            key={props.widget.__id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            layout
            className={cn(
                'row-span-2 h-full',
                wrapperClassName,
            )}
        >
            <Widget
                className={cn(
                    'relative w-full flex flex-col break-inside-avoid',
                    className,
                )}
                {...props}
            />
        </motion.div>
    );
};
