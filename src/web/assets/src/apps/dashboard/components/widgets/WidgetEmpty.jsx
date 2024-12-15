import { cn } from '@utils';

export function WidgetEmpty({ error, className }) {
    return (
        <div
            className={cn(
                'mc-pointer-events-none',
                'mc-flex-1 mc-absolute mc-inset-0 mc-w-full mc-h-full mc-flex mc-flex-col mc-justify-center',
                className,
            )}
        >
            <div className="mc-mx-auto mc-text-slate-500">
                {Craft.t('metrix', 'No data available.')}
            </div>
        </div>
    );
}
