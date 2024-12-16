import { useState, useEffect } from 'react';

import { FadeIn } from '@components/FadeIn';

import { WidgetHeader } from '@dashboard/components/widgets/WidgetHeader';
import { WidgetLoading } from '@dashboard/components/widgets/WidgetLoading';
import { WidgetError } from '@dashboard/components/widgets/WidgetError';
import { WidgetEmpty } from '@dashboard/components/widgets/WidgetEmpty';

import useWidgetStore from '@dashboard/hooks/useWidgetStore';

import { api, cn } from '@utils';

export function Widget({
    widget,
    afterFetchData,
    renderContent,
    className,
}) {
    const { fetchWidgetData } = useWidgetStore();

    const {
        __id,
        loading,
        error,
        data,
        waitForData,
        chartData,
    } = widget;

    useEffect(() => {
        if (!waitForData) {
            fetchWidgetData(__id).then((responseData) => {
                if (afterFetchData) {
                    afterFetchData(responseData);
                }
            });
        }
    }, [__id, waitForData, fetchWidgetData, afterFetchData]);

    // Special-handling for realtime widgets
    useEffect(() => {
        if (data.period !== 'verbb\\metrix\\periods\\Realtime') {
            return;
        }

        // Poll every 10 seconds
        const interval = setInterval(() => {
            fetchWidgetData(__id).then((responseData) => {
                if (afterFetchData) {
                    afterFetchData(responseData);
                }
            });
        }, 10000);

        return () => { return clearInterval(interval); };
    }, [__id, data.period, waitForData, fetchWidgetData, afterFetchData]);

    return (
        <div className={cn('pane mc-group mc-flex mc-flex-col', className)}>
            <WidgetHeader widget={widget} />

            {loading && <WidgetLoading />}
            {error && <WidgetError error={error} />}

            <FadeIn show={!loading && !error}>
                {chartData && chartData.rows ? renderContent(chartData) : <WidgetEmpty />}
            </FadeIn>
        </div>
    );
}
