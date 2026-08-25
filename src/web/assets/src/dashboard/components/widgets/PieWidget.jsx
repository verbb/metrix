import { useRef, useState, useEffect } from 'react';

import { WIDGET_ICONS } from '@icons/widgetIcons';

import { ChartRenderer } from '@dashboard/components/charts/ChartRenderer';
import { ChartLegend } from '@dashboard/components/charts/ChartLegend';
import {
    buildBaseChartOptions,
    buildPieLegendItems,
    getAxisFormatters,
    preprocessPieRows,
} from '@dashboard/components/charts/chartOptions';
import { WidgetLarge } from '@dashboard/components/widgets/WidgetLarge';

import { useCustomTooltip } from '@dashboard/hooks/useCustomTooltip';

import { CHART_COLORS } from '@utils';

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

    // Parallel dashboard hydration sets chartData without Widget's afterFetchData hook.
    useEffect(() => {
        if (!widget.chartData?.rows?.length) {
            setLegend([]);
            return;
        }

        setLegend(buildPieLegendItems(preprocessPieRows(widget.chartData.rows, 1)));
    }, [widget.chartData]);

    function syncLegendVisibility() {
        if (!chartRef.current) {
            return;
        }

        setLegend((prev) => prev.map((item, index) => ({
            ...item,
            hidden: !chartRef.current.getDataVisibility(index),
        })));
    }

    function renderContent(data) {
        const processedRows = preprocessPieRows(data.rows, 1);
        const labels = processedRows.map((row) => row[0]);
        const values = processedRows.map((row) => row[1]);
        const { xAxisTooltipFormat, yAxisTooltipFormat } = getAxisFormatters(data.cols);
        const options = buildBaseChartOptions({ customTooltip, data, widget });

        options.cutout = '75%';
        options.layout = { padding: { top: 30, bottom: 130 } };

        return (
            <ChartRenderer
                ref={chartRef}
                type="doughnut"
                chartProps={{
                    key: widget.data.type,
                    data: {
                        labels,
                        datasets: [{
                            data: values,
                            backgroundColor: CHART_COLORS,
                            hoverBackgroundColor: CHART_COLORS,
                            borderWidth: 0,
                            hoverBorderWidth: 0,
                            yAxisID: 'y',
                            yAxisFormatter: yAxisTooltipFormat,
                            xAxisFormatter: xAxisTooltipFormat,
                        }],
                    },
                    options,
                }}
                tooltipRef={tooltipRef}
                tooltipData={tooltipData}
                tooltipPos={tooltipPos}
                tooltipVisible={tooltipVisible}
            >
                <ChartLegend
                    chartRef={chartRef}
                    legendItems={legend}
                    onLegendToggle={syncLegendVisibility}
                />
            </ChartRenderer>
        );
    }

    return <WidgetLarge className="h-widget-2" renderContent={renderContent} {...props} />;
};

PieWidget.meta = {
    name: 'Pie',
    icon: WIDGET_ICONS.pie,
};
