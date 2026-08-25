import { forwardRef } from 'react';

import { cn, format } from '@utils';

const ChartTooltip = forwardRef(({ data, position, visibility }, ref) => {
    const dataPoints = data?.tooltipModel?.dataPoints?.filter((point) => {
        return point.dataset.yAxisID === 'y';
    }) ?? [];

    const primaryPoint = dataPoints[0];
    const metric = format(primaryPoint?.label || '', primaryPoint?.dataset?.xAxisFormatter);
    const label = data?.widget?.data?.metricLabel;

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

                <div className="flex flex-col gap-1">
                    <div className="text-[10px] text-gray-500">{metric}</div>

                    {dataPoints.map((point, index) => {
                        const color = data?.tooltipModel?.labelColors?.[index]?.backgroundColor;
                        const seriesLabel = point.dataset?.label || label;
                        const value = format(point?.raw || '', point?.dataset?.yAxisFormatter);

                        return (
                            <div
                                key={`${seriesLabel}-${index}`}
                                className="flex flex-row justify-between items-center gap-4"
                            >
                                <span className="flex items-center">
                                    <div
                                        className="w-3 h-3 mr-1 rounded-full"
                                        style={{ background: color }}
                                    />
                                    <span>{seriesLabel}</span>
                                </span>

                                <span className="text-base font-bold">{value}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

ChartTooltip.displayName = 'ChartTooltip';

export { ChartTooltip };
