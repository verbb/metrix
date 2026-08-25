import { forwardRef } from 'react';

import { Bar, Doughnut, Line } from '@dashboard/components/charts/Chart';
import { ChartTooltip } from '@dashboard/components/charts/ChartTooltip';
import { CHART_PANE_HEIGHT } from '@dashboard/components/charts/chartOptions';

const CHART_COMPONENTS = {
    line: Line,
    bar: Bar,
    doughnut: Doughnut,
};

/**
 * Shared chart shell — pane height, Chart.js component, and custom tooltip overlay.
 */
export const ChartRenderer = forwardRef(function ChartRenderer({
    type = 'line',
    chartProps,
    tooltipRef,
    tooltipData,
    tooltipPos,
    tooltipVisible,
    height = CHART_PANE_HEIGHT,
    className = 'h-full flex flex-col relative pt-4',
    children,
}, ref) {
    const ChartComponent = CHART_COMPONENTS[type] || Line;

    return (
        <div className={className}>
            <div className="relative w-full" style={{ height }}>
                <ChartComponent ref={ref} {...chartProps} />

                <ChartTooltip
                    ref={tooltipRef}
                    data={tooltipData}
                    position={tooltipPos}
                    visibility={tooltipVisible}
                />
            </div>

            {children}
        </div>
    );
});
