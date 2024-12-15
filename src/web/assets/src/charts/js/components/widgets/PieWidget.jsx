import { useRef, useState, useCallback } from 'react';
import { BiSolidDoughnutChart } from 'react-icons/bi';

import { useCustomTooltip } from '@hooks/useCustomTooltip';

import { Doughnut } from '@components/charts/Chart';
import { ChartTooltip } from '@components/charts/ChartTooltip';
import { ChartLegend } from '@components/charts/ChartLegend';
import { WidgetLarge } from '@components/widgets/WidgetLarge';

import {
    api, chartFormat, chartColors,
} from '@utils';

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
                        backgroundColor: chartColors,
                        hoverBackgroundColor: chartColors,
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
            <div className="mc-h-full mc-flex mc-flex-col mc-relative mc-pt-4">
                <div className="mc-relative mc-w-full" style={{ height: '25.3rem' }}>
                    <Doughnut ref={chartRef} {...chartOptions} />

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

    return <WidgetLarge className="mc-h-[29rem]" afterFetchData={afterFetchData} renderContent={renderContent} {...props} />;
};

PieWidget.meta = {
    name: 'Pie',
    icon: BiSolidDoughnutChart,
};
