import { motion } from 'framer-motion';

import { Widget } from '@components/widget/Widget';

import { cn } from '@utils';

export const WidgetSmall = ({ className, wrapperClassName, ...props }) => {
    return (
        <motion.div
            key={props.widget.__id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            layout
            className={cn(
                wrapperClassName,
            )}
        >
            <Widget
                className={cn(
                    'mc-relative mc-w-full mc-flex mc-flex-col mc-break-inside-avoid',
                    className,
                )}
                {...props}
            />
        </motion.div>
    );
};
