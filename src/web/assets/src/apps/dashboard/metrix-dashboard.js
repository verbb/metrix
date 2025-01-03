// CSS needs to be imported here as it's treated as a module
import '@shared/scss/style.scss';

// Accept HMR as per: https://vitejs.dev/guide/api-hmr.html
if (import.meta.hot) {
    import.meta.hot.accept();
}

if (typeof Craft.Metrix === typeof undefined) {
    Craft.Metrix = {};
}

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { nanoid } from 'nanoid';

import { Dashboard } from '@dashboard/components/Dashboard.jsx';
import { WidgetLarge } from '@dashboard/components/widgets/WidgetLarge.jsx';
import { WidgetSmall } from '@dashboard/components/widgets/WidgetSmall.jsx';

import useAppStore from '@dashboard/hooks/useAppStore';
import useWidgetStore from '@dashboard/hooks/useWidgetStore';
import useWidgetSettingsStore from '@dashboard/hooks/useWidgetSettingsStore';

import MetrixConfig from '@shared/MetrixConfig.js';
import { addPortalContainer } from '@utils';
import { preloadWidgets } from '@utils/widgets';

Craft.Metrix.Dashboard = Garnish.Base.extend({
    init(settings) {
        addPortalContainer();

        const container = document.querySelector('.metrix-dashboard');
        const root = createRoot(container);

        // Initialize stores with data before rendering
        const { loadWidgets } = useWidgetStore.getState();
        const { loadSettings, fetchMetrics, fetchDimensions } = useWidgetSettingsStore.getState();

        const {
            setNewWidget,
            setPeriodOptions,
            setViewOptions,
            setPresets,
            setSources,
            setRealtimeInterval,
        } = useAppStore.getState();

        const {
            widgets,
            widgetSettings,
            realtimeInterval,
            newWidget,
            periodOptions,
            viewOptions,
            presets,
            sources,
        } = settings;

        loadWidgets(preloadWidgets(widgets));
        loadSettings(widgetSettings);
        setRealtimeInterval(realtimeInterval);
        setNewWidget(newWidget);
        setPeriodOptions(periodOptions);
        setViewOptions(viewOptions);
        setPresets(presets);
        setSources(sources);

        root.render(createElement(Dashboard, {
            widgetStore: useWidgetStore,
        }));
    },
});

Craft.Metrix.Config = new MetrixConfig();

// Fire an event so plugins can reliably hook in
document.dispatchEvent(new CustomEvent('onMetrixConfigReady', {
    bubbles: true,
}));

Craft.Metrix.SharedComponents = {
    WidgetLarge,
    WidgetSmall,
};
