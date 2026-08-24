import { forwardRef } from 'react';

import { cn, format } from '@utils';

const ChartTooltip = forwardRef(({ data, position, visibility }, ref) => {
    const dataPoint = data?.tooltipModel?.dataPoints.find((dataPoint) => {
        return dataPoint.dataset.yAxisID == 'y';
    });

    const metric = format(dataPoint?.label || '', dataPoint?.dataset?.xAxisFormatter);
    const label = data?.widget?.data?.metricLabel;
    const value = format(dataPoint?.raw || '', dataPoint?.dataset?.yAxisFormatter);
    const color = data?.tooltipModel?.labelColors[0].backgroundColor;

    return (
        <div
            ref={ref}
            className={cn(
                'metrix-chart-tooltip absolute rounded shadow overflow-hidden pointer-events-none whitespace-nowrap',
                'px-3 py-2 text-xs',
            )}
            style={{
                top: position?.top || 0,
                left: position?.left || 0,
                display: visibility ? 'block' : 'none',
            }}
        >
            <div className="metrix-chart-tooltip__body flex flex-col">
                <div className="flex justify-between items-center">
                    <span className="font-semibold mb-1 text-sm">{label}</span>
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-row justify-between items-center">
                        <span className="flex items-center mr-4">
                            <div className="w-3 h-3 mr-1 rounded-full" style={{ background: color }}></div>
                            <span>{metric}</span>
                        </span>

                        <span className="text-base font-bold">{value}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

ChartTooltip.displayName = 'ChartTooltip';

export { ChartTooltip };
