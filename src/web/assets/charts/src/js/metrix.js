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

import useWidgetStore from '@hooks/useWidgetStore';
import useWidgetSettingsStore from '@hooks/useWidgetSettingsStore';

import widgetData from './widget-data';
import widgetSettings from './widget-settings';

import { Dashboard } from './Dashboard.jsx';

import { preloadWidgets } from '@utils/widgets';

Craft.Metrix.Dashboard = Garnish.Base.extend({
    init(settings) {
        const container = document.querySelector('.metrix-dashboard');
        const root = createRoot(container);

        // Initialize stores with data before rendering
        const { loadWidgets } = useWidgetStore.getState();
        const { loadSettings } = useWidgetSettingsStore.getState();

        loadWidgets(preloadWidgets(widgetData[0].widgets));
        loadSettings(widgetSettings);

        root.render(createElement(Dashboard, {
            widgetStore: useWidgetStore,
        }));
    },
});
