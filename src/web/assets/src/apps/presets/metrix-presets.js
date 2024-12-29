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

import { Presets } from '@presets/components/Presets.jsx';

import useAppStore from '@presets/hooks/useAppStore';
import useWidgetSettingsStore from '@presets/hooks/useWidgetSettingsStore';

import MetrixConfig from '@shared/MetrixConfig.js';
import { addPortalContainer } from '@utils';
import { preloadWidgets } from '@utils/widgets';

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

Craft.Metrix.Config = new MetrixConfig();

// Fire an event so plugins can reliably hook in
document.dispatchEvent(new CustomEvent('onMetrixConfigReady', {
    bubbles: true,
}));
