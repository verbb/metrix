import { Button } from '@components/ui/Button';
import { CopyButton } from '@components/ui/CopyButton';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/Popover';

import { cn, getErrorMessage } from '@utils';

export function WidgetError({ error, className }) {
    const errorDetail = getErrorMessage(error.error);

    const errorDetailText = [
        errorDetail.heading,
        errorDetail.text,
        errorDetail.trace.join('\n'),
    ].join('\n');

    return (
        <div
            className={cn(
                'mc-flex-1 mc-absolute mc-z-[1] mc-pt-10 mc-px-4 mc-inset-0 mc-w-full mc-h-full mc-flex mc-flex-col mc-justify-center',
                className,
            )}
        >
            <div className="mc-text-center mc-text-red-500">
                {error.message}
            </div>

            <div className="mc-text-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="mc-mt-2 mc-text-[11px] mc-px-2 mc-py-0.5 mc-rounded">
                            {Craft.t('metrix', 'Details')}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="mc-z-[100] mc-w-[320px] md:mc-w-[500px] mc-break-words">
                        <CopyButton className="mc-absolute mc-top-0 mc-right-0 mc-py-1 mc-px-1 mc-mx-1 mc-my-1 mc-rounded" value={errorDetailText} />

                        <strong className="mc-block mc-mb-1">{errorDetail.heading}</strong>
                        <small className="mc-block mc-mb-1">{errorDetail.text}</small>

                        <small className="mc-block mc-font-mono mc-text-[9px] mc-whitespace-nowrap mc-overflow-auto">
                            {errorDetail.trace.map((str) => {
                                return <span key={str} className="mc-block">{str}</span>;
                            })}
                        </small>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
