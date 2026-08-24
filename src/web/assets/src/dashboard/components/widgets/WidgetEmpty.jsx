import { cn } from '@utils';

export function WidgetEmpty({ error, className }) {
    return (
        <div
            className={cn(
                'pointer-events-none',
                'flex-1 absolute inset-0 w-full h-full flex flex-col justify-center',
                className,
            )}
        >
            <div className="mx-auto text-gray-550">
                {Craft.t('metrix', 'No data available.')}
            </div>
        </div>
    );
}
