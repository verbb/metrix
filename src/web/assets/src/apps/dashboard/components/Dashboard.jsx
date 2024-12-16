import { useState, useEffect } from 'react';

import LoadingSpinner from '@components/LoadingSpinner';

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

    const sources = useAppStore((state) => { return state.sources; });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingPresets, setLoadingPresets] = useState(false);
    const [errorPresets, setErrorPresets] = useState(null);

    // Load currentView from query string on initial mount
    useEffect(() => {
        const viewFromQuery = getQueryParam('view');
        const defaultView = viewOptions[0]?.value;

        if (viewOptions.length > 0) {
            const initialView = viewFromQuery || defaultView;
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
            const { data: presetWidgets } = await api.get('widgets', { view: currentView, preset });
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

    const handleViewChange = async(view) => {
        setCurrentView(view);

        // Update query string
        setQueryParam('view', view);

        clearWidgets();
        setLoading(true);
        setError(null);

        try {
            const { data: presetWidgets } = await api.get('widgets', { view });
            const preloadedWidgets = preloadWidgets(presetWidgets);

            loadWidgets(preloadedWidgets);
        } catch (error) {
            console.error('Failed to load widgets:', error);

            setError({
                message: Craft.t('metrix', 'Failed to load widgets.'),
                error,
            });
        } finally {
            setLoading(false);
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
                <div className="mc-w-full mc-h-[50vh] mc-flex mc-items-center mc-justify-center">
                    <LoadingSpinner size="large" />
                </div>
            );
        }

        if (error) {
            const errorDetail = getErrorMessage(error?.error);

            return (
                <div className="mc-w-full mc-h-[50vh] mc-flex mc-items-center mc-justify-center">
                    <div className="mc-text-red-500 mc-text-lg mc-text-center">
                        <strong className="mc-block mc-mb-1">{errorDetail.heading}</strong>
                        <small className="mc-block mc-mb-1">{errorDetail.text}</small>

                        <small className="mc-block mc-font-mono mc-text-[9px] mc-whitespace-nowrap mc-overflow-auto">
                            {errorDetail.trace.map((str) => {
                                return <span key={str} className="mc-block">{str}</span>;
                            })}
                        </small>
                    </div>
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
        <div className="mc-mx-auto mc-max-w-screen-xl">
            <DashboardHeader
                viewOptions={viewOptions}
                currentView={currentView}
                onChangeView={handleViewChange}
                showHeader={showHeader()}
                showHeaderActions={showHeaderActions()}
            />

            {renderContent()}
        </div>
    );
};
