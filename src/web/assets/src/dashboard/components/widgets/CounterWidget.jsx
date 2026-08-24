import { useRef, useCallback, useMemo } from 'react';

import { WIDGET_ICONS } from '@icons/widgetIcons';

import { WidgetSmall } from '@dashboard/components/widgets/WidgetSmall';

import {
    api, cn, format, chartFormat,
} from '@utils';

export const CounterWidget = (props) => {
    const { widget } = props;

    function renderContent(data) {
        const chartCol = data.cols[0];
        const chartColFormat = chartFormat(chartCol, 'label');
        const chartData = data.rows[0][0];

        const prevChartCol = data.cols[1];
        let preChartColFormat = null;
        let prevChartData = null;

        if (prevChartCol) {
            preChartColFormat = chartFormat(prevChartCol, 'label');
            // eslint-disable-next-line prefer-destructuring
            prevChartData = data.rows[0][1];
        }

        return (
            <div className="h-full flex flex-col space-y-2 items-center justify-center">
                <div className="text-gray-600 text-5xl font-bold">{format(chartData, chartColFormat)}</div>

                {prevChartCol && (
                    <div className="text-gray-550 text-base">
                        <span className={cn(
                            'font-medium',
                            prevChartData > 0 ? 'text-green-500' : 'text-red-500',
                        )}>
                            {format(prevChartData, preChartColFormat)}
                        </span>

                        <span className="ml-1">{prevChartCol.label}</span>
                    </div>
                )}
            </div>
        );
    }

    return <WidgetSmall className="h-widget-1" renderContent={renderContent} {...props} />;
};

CounterWidget.meta = {
    name: 'Counter',
    icon: WIDGET_ICONS.counter,
};
