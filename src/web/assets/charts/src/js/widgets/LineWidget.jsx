import { useRef, useCallback } from 'react';
import { TbChartAreaLineFilled } from 'react-icons/tb';

import { useCustomTooltip } from '@hooks/useCustomTooltip';

import { Line } from '@components/charts/Chart';
import { ChartTooltip } from '@components/charts/ChartTooltip';
import { WidgetLarge } from '@components/widget/WidgetLarge';

import {
    api, format, chartFormat, chartColors, hexToRgba,
} from '@utils';

export const LineWidget = (props) => {
    const { widget } = props;

    const chartRef = useRef(null);

    const {
        tooltipRef,
        tooltipVisible,
        tooltipData,
        tooltipPos,
        customTooltip,
    } = useCustomTooltip();

    const fetchData = useCallback((payload) => {
        return api.get('widget-data', { data: 'line-widget-data', ...payload });
    }, []);

    function renderContent(data) {
        // Prepare data for Chart.js
        const labels = data.chart.rows.map((row) => { return row[0]; });
        const values = data.chart.rows.map((row) => { return row[1]; });

        const xAxisFormat = chartFormat(data.chart.cols[0], 'label');
        const xAxisTooltipFormat = chartFormat(data.chart.cols[0], 'tooltip');
        const yAxisFormat = chartFormat(data.chart.cols[1], 'label');
        const yAxisTooltipFormat = chartFormat(data.chart.cols[1], 'tooltip');

        const chartOptions = {
            data: {
                labels,
                datasets: [
                    {
                        data: values,
                        borderColor: chartColors[0],
                        pointBackgroundColor: chartColors[0],
                        pointHoverBackgroundColor: chartColors[0],
                        yAxisID: 'y',
                        borderWidth: 3,
                        pointHoverBorderColor: 'white',
                        pointHoverBorderWidth: 2,
                        pointHoverRadius: 6,
                        fill: true,
                        tension: 0.4,

                        yAxisFormatter: yAxisTooltipFormat,
                        xAxisFormatter: xAxisTooltipFormat,

                        backgroundColor(context) {
                            const { chart } = context;
                            const { ctx, chartArea } = chart;

                            // Only create gradient if chartArea is available
                            if (!chartArea) {
                                return null;
                            }

                            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);

                            gradient.addColorStop(0, hexToRgba(chartColors[0], '0.2'));
                            gradient.addColorStop(1, hexToRgba(chartColors[0], '0'));

                            return gradient;
                        },
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

                layout: {
                    // We seem to get a jump on the tooltip hover when right on the edge
                    padding: {
                        left: -8,
                        right: 2,
                    },
                },

                scales: {
                    y: {
                        beginAtZero: true,
                        border: {
                            display: false,
                        },
                        ticks: {
                            mirror: true,
                            maxTicksLimit: 10,
                            z: 1,
                            color: chartColors[0],
                            textStrokeColor: '#fff',
                            textStrokeWidth: 3,
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
                            mirror: true,
                            autoSkip: true,
                            color: chartColors[0],
                            textStrokeColor: '#fff',
                            textStrokeWidth: 3,
                            padding: 0,

                            font: {
                                size: 10,
                            },

                            callback(value, index, values) {
                                if (index === 0 || index === values.length - 1) {
                                    return ''; // Skip the first and last tick labels
                                }

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
            <div className="mc-h-full mc-flex mc-flex-col mc-relative mc-pt-4 -mc-mx-[10px]">
                <div className="mc-relative mc-w-full" style={{ height: '25.3rem' }}>
                    <Line ref={chartRef} {...chartOptions} />

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

    return <WidgetLarge className="mc-h-[29rem]" fetchData={fetchData} renderContent={renderContent} {...props} />;
};

LineWidget.meta = {
    name: 'Line',
    icon: TbChartAreaLineFilled,
};
