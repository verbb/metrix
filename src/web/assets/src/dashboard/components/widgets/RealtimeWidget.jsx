import { useRef, useCallback, useMemo } from 'react';

import { WIDGET_ICONS } from '@icons/widgetIcons';

import { WidgetSmall } from '@dashboard/components/widgets/WidgetSmall';

import {
    api, cn, format, chartFormat,
} from '@utils';

export const RealtimeWidget = (props) => {
    const { widget } = props;

    function renderContent(data) {
        const chartCol = data.cols[0];
        const chartColFormat = chartFormat(chartCol, 'label');
        const chartData = data.rows[0][0];

        return (
            <div className="h-full flex flex-col space-y-2 items-center justify-center">
                <div className="text-gray-600 text-5xl font-bold">{format(chartData, chartColFormat)}</div>

                <div className="text-gray-550 text-base">
                    <span className="ml-1">{chartCol.label}</span>
                </div>
            </div>
        );
    }

    return <WidgetSmall className="h-widget-1" renderContent={renderContent} {...props} />;
};

RealtimeWidget.meta = {
    name: 'Realtime',
    icon: WIDGET_ICONS.counter,
    // Fixed server-side label when the widget has no metric field in its schema.
    metricLabel: Craft.t('metrix', 'Active users'),
};
