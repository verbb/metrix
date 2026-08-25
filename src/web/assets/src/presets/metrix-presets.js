import metrixStyles from '../css/style.css?inline';

import '../metrixIcons.js';
import { registerMetrixSchemaFields } from '../forms/registerMetrixSchemaFields.js';

registerMetrixSchemaFields();

if (import.meta.hot) {
    import.meta.hot.accept();
}

import { createElement } from 'react';
import { nanoid } from 'nanoid';

import { MetrixAppErrorBoundary } from '../components/MetrixAppErrorBoundary.jsx';
import { Presets } from '@presets/components/Presets.jsx';

import useAppStore from '@presets/hooks/useAppStore';
import useDashboardAppStore from '@dashboard/hooks/useAppStore';
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

defineMetrixCpConstructor('Presets', (settings) => {
    const {
        widgets,
        widgetSettings,
        newWidget,
        hasSource,
        sources = [],
    } = settings;

    if (!hasSource) {
        return;
    }

    const boot = bootstrapShadowReactApp({
        containerSelector: '.metrix-presets',
        pluginHandle: 'metrix',
        styleTexts: [metrixStyles],
        missingContainerMessage: 'Presets container not found: .metrix-presets',
    });

    if (!boot) {
        return;
    }

    const { mountNode, portalContainer, targetContainer } = boot;

    const { loadSettings } = useWidgetSettingsStore.getState();
    const { setNewWidget } = useAppStore.getState();

    // Capability gating in widget settings reads the dashboard app store.
    useDashboardAppStore.getState().setSources(sources);

    loadSettings(widgetSettings);
    setNewWidget(newWidget);

    mountMetrixReactApp({
        mountNode,
        portalContainer,
        shadowRootSelectors: boot.shadowRootSelectors,
        children: createElement(
            MetrixAppErrorBoundary,
            { surface: 'presets' },
            createElement(Presets, {
                widgets: preloadWidgets(widgets).map((widget) => {
                    widget.__id = nanoid();

                    return widget;
                }),
            }),
        ),
    });

    markContainerReady(targetContainer, 'metrix-presets--ready');
});

Craft.Metrix.Config = new MetrixConfig();

document.dispatchEvent(new CustomEvent('onMetrixConfigReady', {
    bubbles: true,
}));
