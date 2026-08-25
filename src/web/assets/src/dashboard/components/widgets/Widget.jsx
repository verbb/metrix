import { useState, useEffect } from 'react';

import { FadeIn } from '@components/FadeIn';

import { WidgetHeader } from '@dashboard/components/widgets/WidgetHeader';
import { WidgetLoading } from '@dashboard/components/widgets/WidgetLoading';
import { WidgetError } from '@dashboard/components/widgets/WidgetError';
import { WidgetEmpty } from '@dashboard/components/widgets/WidgetEmpty';

import useAppStore from '@dashboard/hooks/useAppStore';
import useWidgetStore from '@dashboard/hooks/useWidgetStore';

import { api, cn } from '@utils';

export function Widget({
    widget,
    afterFetchData,
    renderContent,
    className,
}) {
    const { realtimeInterval } = useAppStore();
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
        if (waitForData || chartData || !data.id) {
            return;
        }

        fetchWidgetData(__id).then((responseData) => {
            if (afterFetchData) {
                afterFetchData(responseData);
            }
        });
    }, [__id, data.id, data.type, waitForData, chartData, fetchWidgetData, afterFetchData]);

    // Poll realtime widgets until data loads; stop while errored so we don't spam the API.
    useEffect(() => {
        if (data.type !== 'verbb\\metrix\\widgets\\Realtime') {
            return;
        }

        if (error) {
            return;
        }

        const interval = setInterval(() => {
            fetchWidgetData(__id).then((responseData) => {
                if (afterFetchData) {
                    afterFetchData(responseData);
                }
            });
        }, realtimeInterval);

        return () => {
            return clearInterval(interval);
        };
    }, [__id, data.period, waitForData, fetchWidgetData, afterFetchData, realtimeInterval, error]);

    return (
        <div className={cn('pane group flex h-full flex-col', className)}>
            <WidgetHeader widget={widget} />

            <div className="relative flex min-h-0 flex-1 flex-col">
                {loading && <WidgetLoading />}
                {error && <WidgetError error={error} />}

                <FadeIn className="flex min-h-0 flex-1 flex-col" show={!loading && !error}>
                    {chartData?.rows?.length ? (
                        <div key={data.type} className="flex min-h-0 flex-1 flex-col">
                            {renderContent(chartData)}
                        </div>
                    ) : (
                        <WidgetEmpty />
                    )}
                </FadeIn>
            </div>
        </div>
    );
}
