import { useRef, useState, useCallback } from 'react';

import { WIDGET_ICONS } from '@icons/widgetIcons';

import { Doughnut } from '@dashboard/components/charts/Chart';
import { ChartTooltip } from '@dashboard/components/charts/ChartTooltip';
import { ChartLegend } from '@dashboard/components/charts/ChartLegend';
import { WidgetLarge } from '@dashboard/components/widgets/WidgetLarge';

import { useCustomTooltip } from '@dashboard/hooks/useCustomTooltip';

import { api, chartFormat, CHART_COLORS } from '@utils';

export const PieWidget = (props) => {
    const { widget } = props;

    const chartRef = useRef(null);

    const [legend, setLegend] = useState([]);

    const {
        tooltipRef,
        tooltipVisible,
        tooltipData,
        tooltipPos,
        customTooltip,
    } = useCustomTooltip();

    const afterFetchData = useCallback((data) => {
        setLegend(chartRef?.current?.legend?.legendItems || []);
    }, []);

    function handleLegendToggle(index) {
        setLegend(chartRef?.current?.legend?.legendItems || []);
    }

    function preprocessData(rows, thresholdPercentage = 1) {
        const totalValue = rows.reduce((sum, row) => { return sum + row[1]; }, 0); // Sum of all values
        const threshold = (thresholdPercentage / 100) * totalValue;

        const groupedRows = [];
        let otherValue = 0;

        rows.forEach((row) => {
            if (row[1] < threshold) {
                otherValue += row[1];
            } else {
                groupedRows.push(row);
            }
        });

        if (otherValue > 0) {
            groupedRows.push([Craft.t('metrix', 'Other'), otherValue]); // Add "Other" category
        }

        return groupedRows;
    }

    function renderContent(data) {
        // Preprocess data to group small values
        const processedRows = preprocessData(data.rows, 1); // Group values < 1%

        // Prepare data for Chart.js
        const labels = processedRows.map((row) => { return row[0]; });
        const values = processedRows.map((row) => { return row[1]; });

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
                        backgroundColor: CHART_COLORS,
                        hoverBackgroundColor: CHART_COLORS,
                        borderWidth: 0,
                        hoverBorderWidth: 0,
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
                cutout: '75%',

                layout: {
                    padding: {
                        top: 30,
                        bottom: 130,
                    },
                },

                plugins: {
                    legend: {
                        display: false,
                    },

                    tooltip: {
                        enabled: false,
                        position: 'cursor',
                        external: (context) => {
                            return customTooltip(context, data, widget);
                        },
                    },
                },
            },
        };

        return (
            <div className="h-full flex flex-col relative pt-4">
                <div className="relative w-full" style={{ height: '25.3rem' }}>
                    <Doughnut key={widget.data.type} ref={chartRef} {...chartOptions} />

                    <ChartTooltip
                        ref={tooltipRef}
                        data={tooltipData}
                        position={tooltipPos}
                        visibility={tooltipVisible}
                    />
                </div>

                <ChartLegend
                    chartRef={chartRef}
                    legendItems={legend}
                    onLegendToggle={handleLegendToggle}
                />
            </div>
        );
    }

    return <WidgetLarge className="h-widget-2" afterFetchData={afterFetchData} renderContent={renderContent} {...props} />;
};

PieWidget.meta = {
    name: 'Pie',
    icon: WIDGET_ICONS.pie,
};
