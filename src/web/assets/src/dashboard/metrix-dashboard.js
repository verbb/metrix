import metrixStyles from '../css/style.css?inline';

import '../metrixIcons.js';
import { registerMetrixSchemaFields } from '../forms/registerMetrixSchemaFields.js';

registerMetrixSchemaFields();

if (import.meta.hot) {
    import.meta.hot.accept();
}

import { createElement } from 'react';

import { MetrixAppErrorBoundary } from '../components/MetrixAppErrorBoundary.jsx';
import { Dashboard } from '@dashboard/components/Dashboard.jsx';
import { WidgetLarge } from '@dashboard/components/widgets/WidgetLarge.jsx';
import { WidgetSmall } from '@dashboard/components/widgets/WidgetSmall.jsx';

import useAppStore from '@dashboard/hooks/useAppStore';
import useWidgetStore from '@dashboard/hooks/useWidgetStore';
import useWidgetSettingsStore from '@dashboard/hooks/useWidgetSettingsStore';

import MetrixConfig from '../MetrixConfig.js';
import {
    bootstrapShadowReactApp,
    defineMetrixCpConstructor,
    ensureCraftNamespace,
    markContainerReady,
    mountMetrixReactApp,
} from '@utils';
import { preloadWidgets } from '@utils/widgets';

ensureCraftNamespace('Metrix');

defineMetrixCpConstructor('Dashboard', (settings) => {
    const boot = bootstrapShadowReactApp({
        containerSelector: '.metrix-dashboard',
        pluginHandle: 'metrix',
        styleTexts: [metrixStyles],
        missingContainerMessage: 'Dashboard container not found: .metrix-dashboard',
    });

    if (!boot) {
        return;
    }

    const { mountNode, portalContainer, targetContainer } = boot;

    const { loadWidgets } = useWidgetStore.getState();
    const { loadSettings } = useWidgetSettingsStore.getState();

    const {
        setNewWidget,
        setPeriodOptions,
        setViewOptions,
        setPresets,
        setSources,
        setRealtimeInterval,
        setGlobalPeriod,
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
    setGlobalPeriod(null);

    mountMetrixReactApp({
        mountNode,
        portalContainer,
        shadowRootSelectors: boot.shadowRootSelectors,
        children: createElement(
            MetrixAppErrorBoundary,
            { surface: 'dashboard' },
            createElement(Dashboard, {
                widgetStore: useWidgetStore,
            }),
        ),
    });

    markContainerReady(targetContainer, 'metrix-dashboard--ready');
});

Craft.Metrix.Config = new MetrixConfig();

Craft.Metrix.SharedComponents = {
    WidgetLarge,
    WidgetSmall,
};

document.dispatchEvent(new CustomEvent('onMetrixConfigReady', {
    bubbles: true,
}));
