import { useRef } from 'react';

import { WIDGET_ICONS } from '@icons/widgetIcons';

import { useCustomTooltip } from '@dashboard/hooks/useCustomTooltip';
import { ChartRenderer } from '@dashboard/components/charts/ChartRenderer';
import {
    buildBaseChartOptions,
    buildCartesianScales,
    buildComparisonLegendPlugin,
    createAreaFill,
    getAxisFormatters,
} from '@dashboard/components/charts/chartOptions';
import { WidgetLarge } from '@dashboard/components/widgets/WidgetLarge';

import { CHART_COLORS } from '@utils';

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
        const labels = data.rows.map((row) => row[0]);
        const values = data.rows.map((row) => row[1]);
        const hasComparison = Boolean(data.comparisonRows?.length);
        const comparisonValues = hasComparison
            ? data.comparisonRows.map((row) => row[1])
            : [];
        const comparisonLabel = data.cols[2]?.label || Craft.t('metrix', 'Previous period');
        const {
            xAxisFormat,
            xAxisTooltipFormat,
            yAxisFormat,
            yAxisTooltipFormat,
        } = getAxisFormatters(data.cols);

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

        const options = buildBaseChartOptions({ customTooltip, data, widget });

        options.plugins.legend = hasComparison
            ? buildComparisonLegendPlugin()
            : { display: false };

        options.elements = {
            line: { tension: 0 },
            point: { radius: 0 },
        };
        options.scale = { ticks: { precision: 0, maxTicksLimit: 8 } };
        // Tooltip hover jumps at the edge without a little horizontal room.
        options.layout = { padding: { left: -8, right: 2 } };
        options.scales = buildCartesianScales({
            xAxisFormat,
            yAxisFormat,
            style: 'line',
        });

        return (
            <ChartRenderer
                ref={chartRef}
                type="line"
                className="h-full flex flex-col relative pt-4 -mx-[10px]"
                chartProps={{
                    key: widget.data.type,
                    data: { labels, datasets },
                    options,
                }}
                tooltipRef={tooltipRef}
                tooltipData={tooltipData}
                tooltipPos={tooltipPos}
                tooltipVisible={tooltipVisible}
            />
        );
    }

    return <WidgetLarge className="h-widget-2" renderContent={renderContent} {...props} />;
};

LineWidget.meta = {
    name: 'Line',
    icon: WIDGET_ICONS.line,
};
