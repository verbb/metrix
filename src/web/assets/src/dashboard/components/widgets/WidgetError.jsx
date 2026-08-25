import {
    Button,
    CopyButton,
    Popover,
} from '@verbb/plugin-kit-react/components';

import { cn, getWidgetErrorDetail } from '@utils';

/** Legacy Lucide clipboard outline — pk `clipboard` is solid FA-style. */
const ClipboardIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
        aria-hidden="true"
    >
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
);

export function WidgetError({ error, className }) {
    const errorDetail = error?.error ? getWidgetErrorDetail(error.error) : null;
    const traceLines = errorDetail?.traceAsArray ?? [];

    // Keep the widget face short — full API/provider text belongs in Details only.
    const displayMessage = error?.message
        || Craft.t('metrix', 'Failed to fetch widget data. Please try again.');

    const detailBody = [
        errorDetail?.text,
        traceLines.length ? traceLines.join('\n') : '',
    ].filter(Boolean).join('\n\n');

    const errorDetailText = errorDetail
        ? [errorDetail.heading, detailBody].filter(Boolean).join('\n\n')
        : '';

    return (
        <div
            className={cn(
                'flex-1 absolute z-[1] pt-10 px-4 inset-0 w-full h-full flex flex-col justify-center',
                className,
            )}
        >
            <div className="text-center text-error">
                {displayMessage}
            </div>

            {errorDetail && detailBody && (
                <div className="text-center">
                    <Popover
                        placement="bottom"
                        flush
                        className="metrix-widget-error-popover z-[100]"
                    >
                        <Button
                            slot="trigger"
                            type="button"
                            variant="outline"
                            size="xs"
                            className="mt-2 text-[11px] px-2 py-0.5"
                        >
                            {Craft.t('metrix', 'Details')}
                        </Button>

                        <div className="metrix-widget-error-details">
                            <CopyButton
                                value={errorDetailText}
                                variant="transparent"
                                className="metrix-widget-error-copy"
                            >
                                <span slot="icon">
                                    <ClipboardIcon />
                                </span>
                            </CopyButton>

                            {errorDetail.heading && (
                                <strong className="block mb-2 text-left">{errorDetail.heading}</strong>
                            )}

                            <pre className="metrix-widget-error-pre">{detailBody}</pre>
                        </div>
                    </Popover>
                </div>
            )}
        </div>
    );
}
