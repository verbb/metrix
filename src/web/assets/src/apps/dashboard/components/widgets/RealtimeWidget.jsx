import { useRef, useCallback, useMemo } from 'react';

import { TbNumber123 } from 'react-icons/tb';

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
            <div className="mc-h-full mc-flex mc-flex-col mc-space-y-2 mc-items-center mc-justify-center">
                <div className="mc-text-slate-600 mc-text-5xl mc-font-bold">{format(chartData, chartColFormat)}</div>

                <div className="mc-text-slate-400 mc-text-base">
                    <span className="mc-ml-1">{chartCol.label}</span>
                </div>
            </div>
        );
    }

    return <WidgetSmall className="mc-h-[14rem]" renderContent={renderContent} {...props} />;
};

RealtimeWidget.meta = {
    name: 'Realtime',
    icon: TbNumber123,
};
