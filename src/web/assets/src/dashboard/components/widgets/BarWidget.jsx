import { useRef, useCallback } from 'react';

import { WIDGET_ICONS } from '@icons/widgetIcons';

import { useCustomTooltip } from '@dashboard/hooks/useCustomTooltip';

import { Bar } from '@dashboard/components/charts/Chart';
import { ChartTooltip } from '@dashboard/components/charts/ChartTooltip';
import { WidgetLarge } from '@dashboard/components/widgets/WidgetLarge';

import {
    api, format, chartFormat, CHART_COLORS, CHART_AXIS_LABEL_COLOR,
} from '@utils';

export const BarWidget = (props) => {
    const { widget } = props;

    const chartRef = useRef(null);

    const {
        tooltipRef,
        tooltipVisible,
        tooltipData,
        tooltipPos,
        customTooltip,
    } = useCustomTooltip();

    function renderContent(data) {
        // Prepare data for Chart.js
        const labels = data.rows.map((row) => { return row[0]; });
        const values = data.rows.map((row) => { return row[1]; });

        const xAxisFormat = chartFormat(data.cols[0], 'label');
        const xAxisTooltipFormat = chartFormat(data.cols[0], 'tooltip');
        const yAxisFormat = chartFormat(data.cols[1], 'label');
        const yAxisTooltipFormat = chartFormat(data.cols[1], 'tooltip');

        const chartOptions = {
            data: {
                labels,
                datasets: [
                    {
                        data: values,
                        backgroundColor: CHART_COLORS[0],
                        yAxisID: 'y',
                        yAxisFormatter: yAxisTooltipFormat,
                        xAxisFormatter: xAxisTooltipFormat,
                    },
                ],
            },
            options: {
                animation: false,
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        display: false,
                    },

                    tooltip: {
                        enabled: false,
                        mode: 'index',
                        intersect: false,
                        position: 'cursor',
                        external: (context) => {
                            return customTooltip(context, data, widget);
                        },
                    },
                },

                elements: {
                    line: { tension: 0 },
                    point: { radius: 0 },
                },

                scale: {
                    ticks: {
                        precision: 0,
                        maxTicksLimit: 8,
                    },
                },

                scales: {
                    y: {
                        beginAtZero: true,
                        border: {
                            display: false,
                        },
                        ticks: {
                            maxTicksLimit: 10,
                            color: CHART_AXIS_LABEL_COLOR,
                            padding: 5,

                            font: {
                                size: 10,
                            },

                            callback(value, index, ticks) {
                                if (index === 0) {
                                    return '';
                                }

                                return format(value, yAxisFormat);
                            },
                        },
                        grid: {
                            display: false,
                            drawTicks: false,
                            drawBorder: false,
                        },
                    },
                    x: {
                        border: {
                            display: false,
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 8,
                            color: CHART_AXIS_LABEL_COLOR,
                            padding: 5,

                            font: {
                                size: 10,
                            },

                            callback(value, index, values) {
                                return format(this.getLabelForValue(value), xAxisFormat);
                            },
                        },
                        grid: {
                            display: false,
                        },
                    },
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
            },
        };

        return (
            <div className="h-full flex flex-col relative pt-4">
                <div className="relative w-full" style={{ height: '25.3rem' }}>
                    <Bar key={widget.data.type} ref={chartRef} {...chartOptions} />

                    <ChartTooltip
                        ref={tooltipRef}
                        data={tooltipData}
                        position={tooltipPos}
                        visibility={tooltipVisible}
                    />
                </div>
            </div>
        );
    }

    return <WidgetLarge className="h-widget-2" renderContent={renderContent} {...props} />;
};

BarWidget.meta = {
    name: 'Bar',
    icon: WIDGET_ICONS.bar,
};
