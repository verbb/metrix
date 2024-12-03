import LoadingSpinner from '@components/LoadingSpinner';

import { cn } from '@utils';

export function WidgetLoading({ className }) {
    return (
        <div
            className={cn(
                'mc-flex-1 mc-absolute mc-inset-0 mc-w-full mc-h-full mc-flex mc-flex-col mc-justify-center',
                className,
            )}
        >
            <LoadingSpinner />
        </div>
    );
}
