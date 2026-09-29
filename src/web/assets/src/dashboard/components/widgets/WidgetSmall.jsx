import { Widget } from '@dashboard/components/widgets/Widget';

import { cn } from '@utils';

export const WidgetSmall = ({ className, wrapperClassName, ...props }) => {
    return (
        <div
            className={cn(
                'h-full',
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
        </div>
    );
};
