import { useState, useEffect, useRef } from 'react';

import { Spinner } from '@verbb/plugin-kit-react/components/Spinner';

import { DashboardHeader } from '@dashboard/components/DashboardHeader';
import { DashboardWidgets } from '@dashboard/components/DashboardWidgets';
import { DashboardEmptyState } from '@dashboard/components/DashboardEmptyState';

import useAppStore from '@dashboard/hooks/useAppStore';
import useWidgetStore from '@dashboard/hooks/useWidgetStore';

import {
    cn,
    api,
    getErrorMessage,
    getQueryParam,
    resolveQueryOption,
    setQueryParam,
} from '@utils';

import { preloadWidgets } from '@utils/widgets';

export const Dashboard = () => {
    const widgets = useWidgetStore((state) => { return state.widgets; });
    const loadWidgets = useWidgetStore((state) => { return state.loadWidgets; });
    const clearWidgets = useWidgetStore((state) => { return state.clearWidgets; });

    const viewOptions = useAppStore((state) => { return state.viewOptions; });
    const currentView = useAppStore((state) => { return state.currentView; });
    const setCurrentView = useAppStore((state) => { return state.setCurrentView; });
    const globalPeriod = useAppStore((state) => { return state.globalPeriod; });
    const setGlobalPeriod = useAppStore((state) => { return state.setGlobalPeriod; });
    const periodOptions = useAppStore((state) => { return state.periodOptions; });

    const sources = useAppStore((state) => { return state.sources; });
    const fetchAllWidgetData = useWidgetStore((state) => { return state.fetchAllWidgetData; });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingPresets, setLoadingPresets] = useState(false);
    const [errorPresets, setErrorPresets] = useState(null);
    const viewRequestId = useRef(0);

    // Load currentView from query string on initial mount
    useEffect(() => {
        const viewFromQuery = getQueryParam('view');

        if (viewOptions.length > 0) {
            const initialView = resolveQueryOption(viewFromQuery, viewOptions);
            setCurrentView(initialView);

            if (viewFromQuery !== initialView) {
                setQueryParam('view', initialView);
            }
        }
    }, [viewOptions, setCurrentView]);

    const handleLoadPresets = async(preset) => {
        setLoadingPresets(true);
        setErrorPresets(null);

        try {
            const { data: presetWidgets } = await api.post('apply-preset', { view: currentView, preset });
            const preloadedWidgets = preloadWidgets(presetWidgets);

            loadWidgets(preloadedWidgets);
        } catch (error) {
            console.error('Failed to load preset widgets:', error);

            setErrorPresets({
                message: Craft.t('metrix', 'Failed to load preset widgets.'),
                error,
            });
        } finally {
            setLoadingPresets(false);
        }
    };

    const handleGlobalPeriodChange = (period) => {
        setGlobalPeriod(period || null);
        fetchAllWidgetData();
    };

    const handleViewChange = async(view) => {
        const requestId = ++viewRequestId.current;
        setCurrentView(view);
        setGlobalPeriod(null);

        // Update query string
        setQueryParam('view', view);

        clearWidgets();
        setLoading(true);
        setError(null);

        try {
            const { data: presetWidgets } = await api.post('widgets', { view });

            if (requestId !== viewRequestId.current) {
                return;
            }

            const preloadedWidgets = preloadWidgets(presetWidgets);

            loadWidgets(preloadedWidgets);
        } catch (error) {
            if (requestId !== viewRequestId.current) {
                return;
            }

            console.error('Failed to load widgets:', error);

            setError({
                message: Craft.t('metrix', 'Failed to load widgets.'),
                error,
            });
        } finally {
            if (requestId === viewRequestId.current) {
                setLoading(false);
            }
        }
    };

    const hasWidgets = widgets.length > 0;
    const hasViewOptions = viewOptions.length > 0;
    const hasSources = sources.length > 0;

    const showHeader = () => {
        if (!hasSources || !hasViewOptions) {
            return false;
        }

        // If we have multiple views, but no widgets, we should be able to switch
        if (viewOptions.length === 0 && !hasWidgets) {
            return false;
        }

        return true;
    };

    const showHeaderActions = () => {
        if (!showHeader() || !hasWidgets) {
            return false;
        }

        return true;
    };

    const renderContent = () => {
        if (!hasSources) {
            return <DashboardEmptyState type="noSources" />;
        }

        if (!hasViewOptions) {
            return <DashboardEmptyState type="noViewOptions" />;
        }

        if (loading) {
            return (
                <div className="w-full h-[50vh] flex items-center justify-center">
                    <Spinner size="lg" centered />
                </div>
            );
        }

        if (error) {
            const errorDetail = getErrorMessage(error?.error);

            return (
                <div className="w-full h-[50vh] flex items-center justify-center text-error text-lg text-center">
                        <strong className="block mb-1">{errorDetail.heading}</strong>
                        <small className="block mb-1">{errorDetail.text}</small>

                        <small className="block font-mono text-[9px] whitespace-nowrap overflow-auto">
                            {errorDetail.traceAsArray.map((str) => (
                                <span key={str} className="block">{str}</span>
                            ))}
                        </small>
                </div>
            );
        }

        if (hasWidgets) {
            return <DashboardWidgets widgets={widgets} loading={loading} />;
        }

        return (
            <DashboardEmptyState
                type="noWidgets"
                onPresetSelect={handleLoadPresets}
                loadingPresets={loadingPresets}
                errorPresets={errorPresets}
            />
        );
    };

    return (
        <div className="mx-auto max-w-screen-xl">
            <DashboardHeader
                viewOptions={viewOptions}
                currentView={currentView}
                onChangeView={handleViewChange}
                periodOptions={periodOptions}
                globalPeriod={globalPeriod}
                onGlobalPeriodChange={handleGlobalPeriodChange}
                showHeader={showHeader()}
                showHeaderActions={showHeaderActions()}
                showGlobalPeriod={hasWidgets}
            />

            {renderContent()}
        </div>
    );
};
