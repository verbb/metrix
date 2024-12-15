// CSS needs to be imported here as it's treated as a module
import '../scss/style.scss';

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

import { Dashboard } from '@components/dashboard/Dashboard.jsx';
import { Presets } from '@components/presets/Presets.jsx';

import useAppStore from '@hooks/useAppStore';
import useWidgetStore from '@hooks/useWidgetStore';
import useWidgetSettingsStore from '@hooks/useWidgetSettingsStore';

import { preloadWidgets } from '@utils/widgets';

// Add a single container for portal content to be added to. Radix doesn't support customising the portal
// attributes, and we need to add `metrix-ui` to all portal items, and we can't add extra divs to
// portal components without messing up things (Dialog).
function addPortalContainer() {
    if (!document.querySelector('.metrix-portal-container.metrix-ui')) {
        const portalContainer = document.createElement('div');
        portalContainer.className = 'metrix-portal-container metrix-ui';

        document.body.appendChild(portalContainer);
    }
}

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

Craft.Metrix.Presets = Garnish.Base.extend({
    init(settings) {
        addPortalContainer();

        const container = document.querySelector('.metrix-presets');
        const root = createRoot(container);

        const { loadSettings } = useWidgetSettingsStore.getState();
        const { setNewWidget } = useAppStore.getState();

        const { widgets, widgetSettings, newWidget } = settings;

        loadSettings(widgetSettings);
        setNewWidget(newWidget);

        root.render(createElement(Presets, {
            widgets: preloadWidgets(widgets).map((widget) => {
                widget.__id = nanoid();

                return widget;
            }),
        }));
    },
});
