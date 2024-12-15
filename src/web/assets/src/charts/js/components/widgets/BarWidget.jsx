import { useRef, useCallback } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/solid';

import { useCustomTooltip } from '@hooks/useCustomTooltip';

import { Bar } from '@components/charts/Chart';
import { ChartTooltip } from '@components/charts/ChartTooltip';
import { WidgetLarge } from '@components/widgets/WidgetLarge';

import {
    api, cn, format, chartFormat, theme, chartColors, hexToRgba,
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
                        backgroundColor: chartColors[0],
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
                            color: theme.colors.slate[600],
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
                            color: theme.colors.slate[600],
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
            <div className="mc-h-full mc-flex mc-flex-col mc-relative mc-pt-4">
                <div className="mc-relative mc-w-full" style={{ height: '25.3rem' }}>
                    <Bar ref={chartRef} {...chartOptions} />

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

    return <WidgetLarge className="mc-h-[29rem]" renderContent={renderContent} {...props} />;
};

BarWidget.meta = {
    name: 'Bar',
    icon: ChartBarIcon,
};
