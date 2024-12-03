import { cn } from '@utils';

export function WidgetError({ error, className }) {
    return (
        <div
            className={cn(
                'mc-flex-1 mc-absolute mc-inset-0 mc-w-full mc-h-full mc-flex mc-flex-col mc-justify-center',
                className,
            )}
        >
            <div className="mc-mx-auto mc-text-red-500">
                {error}
            </div>
        </div>
    );
}
