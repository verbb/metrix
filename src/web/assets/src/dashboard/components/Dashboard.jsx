import { useState, useEffect, useRef, useCallback } from 'react';

import { Spinner } from '@verbb/plugin-kit-react/components/Spinner';

import { DashboardHeader } from '@dashboard/components/DashboardHeader';
import { DashboardWidgets } from '@dashboard/components/DashboardWidgets';
import { DashboardEmptyState, PresetError } from '@dashboard/components/DashboardEmptyState';
import { DashboardSetup } from '@dashboard/components/DashboardSetup';
import { WidgetNewDialog } from '@dashboard/components/widgets/WidgetNew';

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
    const setup = useAppStore((state) => { return state.setup; });
    const setSetup = useAppStore((state) => { return state.setSetup; });
    const canManageViewLayouts = useAppStore((state) => { return state.canManageViewLayouts; });
    const fetchAllWidgetData = useWidgetStore((state) => { return state.fetchAllWidgetData; });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingPresets, setLoadingPresets] = useState(false);
    const [errorPresets, setErrorPresets] = useState(null);
    const [isNewWidgetOpen, setIsNewWidgetOpen] = useState(false);
    const viewRequestId = useRef(0);

    // Load currentView from query string on initial mount
    useEffect(() => {
        const viewFromQuery = getQueryParam('view');

        if (viewOptions.length > 0) {
            const initialView = resolveQueryOption(viewFromQuery, viewOptions);
            setCurrentView(initialView);

            if (viewFromQuery !== initialView) {
                setQueryParam('view', initialView, { replace: true });
            }
        }
    }, [viewOptions, setCurrentView]);

    const handleLoadPresets = async(preset) => {
        const requestId = ++viewRequestId.current;
        setLoadingPresets(true);
        setErrorPresets(null);

        try {
            const { data: presetWidgets } = await api.post('apply-preset', { view: currentView, preset });

            if (requestId !== viewRequestId.current) {
                return;
            }

            const preloadedWidgets = preloadWidgets(presetWidgets);

            loadWidgets(preloadedWidgets);
        } catch (error) {
            if (requestId !== viewRequestId.current) {
                return;
            }

            console.error('Failed to load preset widgets:', error);

            setErrorPresets({
                message: Craft.t('metrix', 'Failed to load preset widgets.'),
                error,
            });
        } finally {
            if (requestId === viewRequestId.current) {
                setLoadingPresets(false);
            }
        }
    };

    const handleGlobalPeriodChange = (period) => {
        setGlobalPeriod(period || null);
        fetchAllWidgetData();
    };

    const handleViewChange = useCallback(async(view, updateUrl = true) => {
        const requestId = ++viewRequestId.current;
        setCurrentView(view);
        setGlobalPeriod(null);
        setLoadingPresets(false);
        setErrorPresets(null);

        // Update query string
        if (updateUrl) {
            setQueryParam('view', view);
        }

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
    }, [setCurrentView, setGlobalPeriod, clearWidgets, loadWidgets]);

    useEffect(() => {
        const handlePopState = () => {
            const view = resolveQueryOption(getQueryParam('view'), viewOptions);

            if (view && view !== useAppStore.getState().currentView) {
                handleViewChange(view, false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [viewOptions, handleViewChange]);

    const hasWidgets = widgets.length > 0;
    const hasViewOptions = viewOptions.length > 0;
    const hasSources = sources.length > 0;

    // The first widget ends setup for good, so removing it again shows the empty view rather than the checklist.
    useEffect(() => {
        if (hasWidgets && setup) {
            setSetup(null);
        }
    }, [hasWidgets, setup, setSetup]);

    const showSetup = Boolean(setup) && !hasWidgets && (hasViewOptions || canManageViewLayouts);
    const showViewSelect = hasSources && hasViewOptions;
    const showHeaderActions = showViewSelect && hasWidgets;

    const renderContent = () => {
        if (showSetup) {
            return (
                <>
                    <DashboardSetup
                        setup={setup}
                        loadingPresets={loadingPresets}
                        onPresetSelect={handleLoadPresets}
                        onNewWidget={() => setIsNewWidgetOpen(true)}
                    />

                    <PresetError errorPresets={errorPresets} />
                </>
            );
        }

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
                onNewWidget={() => setIsNewWidgetOpen(true)}
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
                showViewSelect={showViewSelect}
                showHeaderActions={showHeaderActions}
                showGlobalPeriod={hasWidgets}
            />

            {renderContent()}

            {canManageViewLayouts ? (
                <WidgetNewDialog open={isNewWidgetOpen} onOpenChange={setIsNewWidgetOpen} />
            ) : null}
        </div>
    );
};
