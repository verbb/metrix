import { useRef } from 'react';

import { WIDGET_ICONS } from '@icons/widgetIcons';

import { useCustomTooltip } from '@dashboard/hooks/useCustomTooltip';

import { Line } from '@dashboard/components/charts/Chart';
import { ChartTooltip } from '@dashboard/components/charts/ChartTooltip';
import { WidgetLarge } from '@dashboard/components/widgets/WidgetLarge';

import {
    format, chartFormat, WIDGET_HEIGHT, CHART_COLORS, hexToRgba,
} from '@utils';

function createAreaFill(color) {
    return (context) => {
        const { chart } = context;
        const { ctx, chartArea } = chart;

        if (!chartArea) {
            return null;
        }

        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);

        gradient.addColorStop(0, hexToRgba(color, '0.2'));
        gradient.addColorStop(1, hexToRgba(color, '0'));

        return gradient;
    };
}

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

    function renderContent(data) {
        // Prepare data for Chart.js
        const labels = data.rows.map((row) => { return row[0]; });
        const values = data.rows.map((row) => { return row[1]; });
        const hasComparison = Boolean(data.comparisonRows?.length);
        const comparisonValues = hasComparison
            ? data.comparisonRows.map((row) => { return row[1]; })
            : [];
        const comparisonLabel = data.cols[2]?.label || Craft.t('metrix', 'Previous period');

        const xAxisFormat = chartFormat(data.cols[0], 'label');
        const xAxisTooltipFormat = chartFormat(data.cols[0], 'tooltip');
        const yAxisFormat = chartFormat(data.cols[1], 'label');
        const yAxisTooltipFormat = chartFormat(data.cols[1], 'tooltip');

        const currentDataset = {
            label: widget.data.metricLabel,
            data: values,
            borderColor: CHART_COLORS[0],
            pointBackgroundColor: CHART_COLORS[0],
            pointHoverBackgroundColor: CHART_COLORS[0],
            yAxisID: 'y',
            borderWidth: 3,
            pointHoverBorderColor: 'white',
            pointHoverBorderWidth: 2,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.4,
            yAxisFormatter: yAxisTooltipFormat,
            xAxisFormatter: xAxisTooltipFormat,
            backgroundColor: createAreaFill(CHART_COLORS[0]),
        };

        const datasets = [currentDataset];

        if (hasComparison) {
            datasets.push({
                label: comparisonLabel,
                data: comparisonValues,
                borderColor: CHART_COLORS[1],
                pointBackgroundColor: CHART_COLORS[1],
                pointHoverBackgroundColor: CHART_COLORS[1],
                yAxisID: 'y',
                borderWidth: 3,
                pointHoverBorderColor: 'white',
                pointHoverBorderWidth: 2,
                pointHoverRadius: 5,
                fill: true,
                tension: 0.4,
                yAxisFormatter: yAxisTooltipFormat,
                xAxisFormatter: xAxisTooltipFormat,
                backgroundColor: createAreaFill(CHART_COLORS[1]),
            });
        }

        const chartOptions = {
            data: {
                labels,
                datasets,
            },
            options: {
                animation: false,
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        display: hasComparison,
                        position: 'top',
                        align: 'end',
                        labels: {
                            boxWidth: 10,
                            boxHeight: 10,
                            font: { size: 10 },
                            // Filled swatches with a thin stroke — avoids thick/dashed line legend boxes.
                            generateLabels(chart) {
                                const hiddenOpacity = 0.5;

                                return chart.data.datasets.map((dataset, datasetIndex) => {
                                    const isVisible = chart.isDatasetVisible(datasetIndex);
                                    const opacity = isVisible ? 1 : hiddenOpacity;
                                    const borderColor = dataset.borderColor;

                                    return {
                                        text: dataset.label,
                                        fillStyle: hexToRgba(borderColor, String(0.2 * opacity)),
                                        strokeStyle: hexToRgba(borderColor, String(opacity)),
                                        fontColor: `rgba(55, 65, 81, ${opacity})`,
                                        lineWidth: 1,
                                        // Keep false so Chart.js does not strikethrough — opacity shows "off" state.
                                        hidden: false,
                                        datasetIndex,
                                    };
                                });
                            },
                        },
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
                            color: CHART_COLORS[0],
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
                            color: CHART_COLORS[0],
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
            <div className="h-full flex flex-col relative pt-4 -mx-[10px]">
                <div className="relative w-full" style={{ height: `${(WIDGET_HEIGHT * 2) - 2.7}rem` }}>
                    <Line key={widget.data.type} ref={chartRef} {...chartOptions} />

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

LineWidget.meta = {
    name: 'Line',
    icon: WIDGET_ICONS.line,
};
