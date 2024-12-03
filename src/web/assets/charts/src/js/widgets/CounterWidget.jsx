import { useRef, useCallback, useMemo } from 'react';

import { TbNumber123 } from 'react-icons/tb';

import { WidgetSmall } from '@components/widget/WidgetSmall';

import {
    api, cn, format, chartFormat,
} from '@utils';

export const CounterWidget = (props) => {
    const { widget } = props;

    const fetchData = useCallback((payload) => {
        return api.get('widget-data', { data: 'counter-widget-data', ...payload });
    }, []);

    function renderContent(data) {
        const chartCol = data.chart.cols[0];
        const chartColFormat = chartFormat(chartCol, 'label');
        const chartData = data.chart.rows[0][0];

        const prevChartCol = data.chart.cols[1];
        const preChartColFormat = chartFormat(prevChartCol, 'label');
        const prevChartData = data.chart.rows[0][1];

        return (
            <div className="mc-h-full mc-flex mc-flex-col mc-space-y-2 mc-items-center mc-justify-center">
                <div className="mc-text-slate-600 mc-text-5xl mc-font-bold">{format(chartData, chartColFormat)}</div>

                <div className="mc-text-slate-400 mc-text-base">
                    <span className={cn(
                        'mc-font-medium',
                        prevChartData > 0 ? 'mc-text-green-500' : 'mc-text-red-500',
                    )}>
                        {format(prevChartData, preChartColFormat)}
                    </span>

                    <span className="mc-ml-1">{prevChartCol.label}</span>
                </div>
            </div>
        );
    }

    return <WidgetSmall className="mc-h-[14rem]" fetchData={fetchData} renderContent={renderContent} {...props} />;
};

CounterWidget.meta = {
    name: 'Counter',
    icon: TbNumber123,
};
