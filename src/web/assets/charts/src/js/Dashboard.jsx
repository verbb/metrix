import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { Button } from '@components/ui/Button';
import LoadingSpinner from '@components/LoadingSpinner';
import { WidgetNew } from '@components/widget/WidgetNew';
import { WidgetLayoutSettings } from '@components/widget/WidgetLayoutSettings';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@components/ui/Select';

import useWidgetStore from '@hooks/useWidgetStore';

import NoWidgetsSvg from '@/js/svg/NoWidgetsSvg';

import { cn, api, getErrorMessage } from '@utils';
import { preloadWidgets } from '@utils/widgets';

export const Dashboard = () => {
    const widgets = useWidgetStore((state) => { return state.widgets; });
    const loadWidgets = useWidgetStore((state) => { return state.loadWidgets; });
    const clearWidgets = useWidgetStore((state) => { return state.clearWidgets; });

    const [currentView, setCurrentView] = useState('general');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingPresets, setLoadingPresets] = useState(false);
    const [errorPresets, setErrorPresets] = useState(null);

    const handleLoadPresets = async() => {
        setLoadingPresets(true);
        setErrorPresets(null);

        try {
            const presetWidgets = await api.get('widgets', { view: currentView });
            const preloadedWidgets = preloadWidgets(presetWidgets);

            loadWidgets(preloadedWidgets);
        } catch (err) {
            console.error('Failed to load preset widgets:', err);
            setErrorPresets('Failed to load preset widgets.');
        } finally {
            setLoadingPresets(false);
        }
    };

    const handleViewChange = async(view) => {
        setCurrentView(view);

        clearWidgets();
        setLoading(true);
        setError(null);

        try {
            const presetWidgets = await api.get('widgets', { view });
            const preloadedWidgets = preloadWidgets(presetWidgets);

            loadWidgets(preloadedWidgets);
        } catch (err) {
            console.error('Failed to load widgets:', err);
            setError('Failed to load widgets.');
        } finally {
            setLoading(false);
        }
    };

    const hasWidgets = widgets.length > 0;

    const views = [
        { label: 'General', value: 'general' },
        { label: 'Client', value: 'client' },
        { label: 'SEO Providers', value: 'seo' },
    ];

    return (
        <div className="mc-mx-auto mc-max-w-screen-xl">
            {(hasWidgets || loading || error) && (
                <header className="mc-flex mc-items-center mc-justify-between mc-mb-4">
                    <div className="mc-flex mc-items-center mc-justify-between mc-gap-4">
                        <h1 className="mc-font-bold mc-text-lg" title="Dashboard">Dashboard</h1>

                        <Select value={currentView} onValueChange={handleViewChange}>
                            <SelectTrigger
                                className={cn(
                                    'mc-px-3 mc-py-2 mc-gap-1 mc-text-sm',
                                    'mc-bg-[#c4d0e1] hover:mc-bg-[#bccadc]',
                                    'hover:mc-shadow-none focus:mc-shadow-none',
                                )}
                            >
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent
                                className={cn(
                                    'mc-border mc-bg-white',
                                )}
                            >
                                {views.map((view) => {
                                    return (
                                        <SelectItem
                                            className="focus:mc-bg-slate-100"
                                            key={view.value}
                                            value={view.value}
                                        >
                                            {view.label}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {hasWidgets && <div className="mc-flex mc-gap-2">
                        <WidgetNew />
                        <WidgetLayoutSettings />
                    </div>}
                </header>
            )}

            {(hasWidgets || loading || error) ? (
                <div className="mc-relative">
                    {loading && (
                        <div className="mc-w-full mc-h-[50vh] mc-flex mc-items-center mc-justify-center">
                            <LoadingSpinner size="large" />
                        </div>
                    )}

                    {error && (
                        <div className="mc-w-full mc-h-[50vh] mc-flex mc-items-center mc-justify-center">
                            <div className="mc-text-red-500 mc-text-lg mc-text-center">
                                <strong>{getErrorMessage(error).heading}</strong><br />

                                <small>
                                    {getErrorMessage(error).text}<br />
                                    {getErrorMessage(error).trace}
                                </small>
                            </div>
                        </div>
                    )}

                    <div
                        className={cn(
                            'mc-grid mc-gap-4 mc-grid-cols-1 md:mc-grid-cols-2 lg:mc-grid-cols-3',
                            (loading ? 'mc-opacity-10' : ''),
                        )}
                        style={{
                            gridAutoRows: 'minmax(14rem, auto)',
                        }}
                    >
                        <AnimatePresence>
                            {widgets.map((widget) => {
                                const Component = widget.component;

                                return (
                                    <Component
                                        key={widget.__id}
                                        widget={widget}
                                        wrapperClassName={cn(
                                            'mc-col-span-1',
                                            widget.width === 2 ? 'lg:mc-col-span-2' : '',
                                            widget.width === 3 ? 'lg:mc-col-span-3' : '',
                                        )}
                                    />
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                <div className="zilch mc-flex mc-relative mc-overflow-hidden mc-flex-col mc-items-center mc-justify-center mc-text-center mc-pt-[19rem]">
                    <div className="mc-w-[512px] mc-h-[512px] mc-absolute mc-z-0 mc-top-0 -mc-mt-[5rem]">
                        <NoWidgetsSvg />
                    </div>

                    <div className="mc-relative mc-z-0 mc-flex mc-flex-col mc-items-center">
                        <h2 className="mc-font-semibold mc-text-2xl mc-mb-4 mc-text-slate-600">No widgets yet</h2>

                        <p className="mc-mb-6 mc-text-slate-500">
                            Start adding widgets to see your data at a glance.
                        </p>

                        <div className="mc-flex mc-gap-4">
                            <WidgetNew />

                            <Button
                                variant="primary"
                                size="md"
                                type="button"
                                title="Settings"
                                aria-label="Settings"
                                className="mc-gap-3"
                                onClick={handleLoadPresets}
                                disabled={loadingPresets}
                            >
                            Load preset widgets

                                {loadingPresets && <LoadingSpinner size="tiny" className="mc-border-t-white mc-border-r-white" />}
                            </Button>
                        </div>

                        {errorPresets && (
                            <div className="mc-mt-8 mc-text-red-500 mc-text-lg mc-text-center">
                                <strong>{getErrorMessage(errorPresets).heading}</strong><br />

                                <small>
                                    {getErrorMessage(errorPresets).text}<br />
                                    {getErrorMessage(errorPresets).trace}
                                </small>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
