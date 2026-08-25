import { useRef } from 'react';

import { WIDGET_ICONS } from '@icons/widgetIcons';

import { useCustomTooltip } from '@dashboard/hooks/useCustomTooltip';
import { ChartRenderer } from '@dashboard/components/charts/ChartRenderer';
import {
    buildBaseChartOptions,
    buildCartesianScales,
    getAxisFormatters,
} from '@dashboard/components/charts/chartOptions';
import { WidgetLarge } from '@dashboard/components/widgets/WidgetLarge';

import { CHART_COLORS } from '@utils';

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
        const labels = data.rows.map((row) => row[0]);
        const values = data.rows.map((row) => row[1]);
        const {
            xAxisFormat,
            xAxisTooltipFormat,
            yAxisFormat,
            yAxisTooltipFormat,
        } = getAxisFormatters(data.cols);

        const options = buildBaseChartOptions({ customTooltip, data, widget });

        options.elements = {
            line: { tension: 0 },
            point: { radius: 0 },
        };
        options.scale = { ticks: { precision: 0, maxTicksLimit: 8 } };
        options.scales = buildCartesianScales({
            xAxisFormat,
            yAxisFormat,
            style: 'bar',
        });

        return (
            <ChartRenderer
                ref={chartRef}
                type="bar"
                chartProps={{
                    key: widget.data.type,
                    data: {
                        labels,
                        datasets: [{
                            data: values,
                            backgroundColor: CHART_COLORS[0],
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
            />
        );
    }

    return <WidgetLarge className="h-widget-2" renderContent={renderContent} {...props} />;
};

BarWidget.meta = {
    name: 'Bar',
    icon: WIDGET_ICONS.bar,
};
