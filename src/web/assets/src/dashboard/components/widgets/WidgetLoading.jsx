import { Spinner } from '@verbb/plugin-kit-react/components';

import { cn } from '@utils';

export function WidgetLoading({ className }) {
    return (
        <div
            className={cn(
                'pointer-events-none',
                'flex-1 absolute inset-0 w-full h-full flex flex-col justify-center',
                className,
            )}
        >
            <Spinner size="md" centered />
        </div>
    );
}
