import { useState, useEffect } from 'react';

import { FadeIn } from '@components/FadeIn';
import { WidgetHeader } from '@components/widget/WidgetHeader';
import { WidgetLoading } from '@components/widget/WidgetLoading';
import { WidgetError } from '@components/widget/WidgetError';

import { api, cn } from '@utils';

export function Widget({
    widget,
    fetchData,
    afterFetchData,
    renderContent,
    className,
}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Trigger `afterFetchData` every time the data changes
        if (data && afterFetchData) {
            afterFetchData(data);
        }
    }, [data, afterFetchData]);

    useEffect(() => {
        if (fetchData) {
            setLoading(true);
            setData(null);
            setError(null);

            // Send back a minimal payload
            const payload = {
                id: widget.id,
                source: widget.source,
                type: widget.type,
                period: widget.period,
                metric: widget.metric,
                dimension: widget.dimension,
            };

            fetchData(payload)
                .then((response) => {
                    setData(response);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setError('Failed to load data. Please try again.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [fetchData, widget.id, widget.source, widget.type, widget.period, widget.metric, widget.dimension]);

    return (
        <div className={cn('pane mc-group mc-flex mc-flex-col', className)}>
            <WidgetHeader widget={widget} />

            {loading && <WidgetLoading />}
            {error && <WidgetError error={error} />}

            <FadeIn show={!loading}>
                {data && renderContent(data)}
            </FadeIn>
        </div>
    );
}
