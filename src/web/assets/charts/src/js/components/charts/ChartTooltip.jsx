import { forwardRef } from 'react';

import { cn, format } from '@utils';

const ChartTooltip = forwardRef(({ data, position, visibility }, ref) => {
    const dataPoint = data?.tooltipModel?.dataPoints.find((dataPoint) => {
        return dataPoint.dataset.yAxisID == 'y';
    });

    const metric = format(dataPoint?.label || '', dataPoint?.dataset?.xAxisFormatter);
    const label = data?.widget?.metric;
    const value = format(dataPoint?.raw || '', dataPoint?.dataset?.yAxisFormatter);
    const color = data?.tooltipModel?.labelColors[0].backgroundColor;

    return (
        <div
            ref={ref}
            className={cn(
                'mc-absolute mc-rounded mc-shadow mc-overflow-hidden mc-pointer-events-none mc-whitespace-nowrap',
                'mc-px-3 mc-py-2 mc-bg-slate-800 mc-text-white mc-text-xs',
            )}
            style={{
                top: position?.top || 0,
                left: position?.left || 0,
                display: visibility ? 'block' : 'none',
            }}
        >
            <div className="mc-text-slate-100 mc-flex mc-flex-col">
                <div className="mc-flex mc-justify-between mc-items-center">
                    <span className="mc-font-semibold mc-mb-1 mc-text-sm">{label}</span>
                </div>

                <div className="mc-flex mc-flex-col">
                    <div className="mc-flex mc-flex-row mc-justify-between mc-items-center">
                        <span className="mc-flex mc-items-center mc-mr-4">
                            <div className="mc-w-3 mc-h-3 mc-mr-1 mc-rounded-full" style={{ background: color }}></div>
                            <span>{metric}</span>
                        </span>

                        <span className="mc-text-base mc-font-bold">{value}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

ChartTooltip.displayName = 'ChartTooltip';

export { ChartTooltip };
