import { forwardRef } from 'react';
import { cn } from '@utils';

const sizeMap = {
    tiny: { width: 'mc-w-4', height: 'mc-h-4', border: 'mc-border-2' },
    small: { width: 'mc-w-6', height: 'mc-h-6', border: 'mc-border-2' },
    medium: { width: 'mc-w-8', height: 'mc-h-8', border: 'mc-border-2' },
    large: { width: 'mc-w-12', height: 'mc-h-12', border: 'mc-border-2' },
    huge: { width: 'mc-w-16', height: 'mc-h-16', border: 'mc-border-2' },
};

const LoadingSpinner = forwardRef((props, ref) => {
    const { className, size = 'medium', ...attrs } = props;
    const selectedSize = sizeMap[size] || sizeMap.medium;

    return <div
        ref={ref}
        className={cn(
            'mc-mx-auto mc-border-2 mc-border-transparent mc-rounded-full mc-animate-spin',
            'mc-border-t-red-500 mc-border-r-red-500',
            selectedSize.width,
            selectedSize.height,
            selectedSize.border,
            className,
        )}
        {...attrs}
    />;
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
