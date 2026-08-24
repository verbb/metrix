// Shadow-DOM + PluginKitProvider bootstrap for Metrix CP React apps.
// Mirrors Formie's `react-app.js` — shared mount helpers for dashboard, presets,
// and other full-screen surfaces. Source connect stays light-DOM (Craft field chrome).

import '@verbb/plugin-kit-react/style.css';
import pluginKitStyles from '@verbb/plugin-kit-react/style.css?inline';

import { createElement, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import {
    createCraftHostBridge,
    configure,
    mountShadowApp,
    PluginKitProvider,
} from '@verbb/plugin-kit-react/utils';

export const ensureCraftNamespace = (namespacePath) => {
    if (!namespacePath) {
        throw new Error('ensureCraftNamespace() requires a namespacePath.');
    }

    const parts = namespacePath.split('.').map((part) => part.trim()).filter(Boolean);
    let current = Craft;

    parts.forEach((part) => {
        if (typeof current[part] === typeof undefined) {
            current[part] = {};
        }

        current = current[part];
    });

    return current;
};

const buildMetrixReactConfig = ({
    portalContainer,
    portalClassName,
    shadowRootSelectors,
    translationCategory,
}) => ({
    portalContainer,
    portalClassName: portalClassName || `${translationCategory}-ui`,
    shadowRootSelectors,
    translationCategory: translationCategory || 'metrix',
    hostBridge: createCraftHostBridge(),
});

/**
 * Mount (or re-render) a Metrix CP React app inside a prepared shadow mount node.
 */
export const mountMetrixReactApp = ({
    mountNode,
    portalContainer,
    shadowRootSelectors,
    translationCategory = 'metrix',
    portalClassName,
    children,
    strictMode = false,
    existingRoot = null,
}) => {
    const config = buildMetrixReactConfig({
        portalContainer,
        portalClassName,
        shadowRootSelectors,
        translationCategory,
    });

    const tree = createElement(
        PluginKitProvider,
        config,
        strictMode ? createElement(StrictMode, null, children) : children,
    );

    if (existingRoot) {
        configure(config);
        existingRoot.render(tree);

        return {
            root: existingRoot,
            container: mountNode,
            unmount: () => { existingRoot.unmount(); },
        };
    }

    const root = createRoot(mountNode);
    root.render(tree);

    return {
        root,
        container: mountNode,
        unmount: () => { root.unmount(); },
    };
};

/**
 * Prepare a shadow-DOM mount point and inject kit tokens + screen-local CSS.
 * Pair with `mountMetrixReactApp()` for dashboard/presets surfaces.
 */
export const bootstrapShadowReactApp = ({
    containerSelector,
    pluginHandle,
    styleTexts,
    styleAttr,
    rootAttr,
    portalClassName,
    translationCategory,
    missingContainerMessage = null,
}) => {
    if (!pluginHandle || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pluginHandle)) {
        throw new Error('bootstrapShadowReactApp() requires a kebab-case pluginHandle.');
    }

    const resolvedStyleAttr = styleAttr || `data-${pluginHandle}-shadow-style`;
    const resolvedRootAttr = rootAttr || `data-${pluginHandle}-shadow-root`;
    const resolvedTranslationCategory = translationCategory || pluginHandle;
    // Tokens into each shadow root — head FOUCE CSS alone does not pierce shadow.
    const resolvedStyleTexts = [pluginKitStyles, ...(styleTexts || [])];

    const targetContainer = document.querySelector(containerSelector);

    if (!targetContainer) {
        if (missingContainerMessage) {
            console.error(missingContainerMessage);
        }

        return null;
    }

    const { mountNode, portalContainer } = mountShadowApp({
        element: targetContainer,
        styles: resolvedStyleTexts,
        styleAttr: resolvedStyleAttr,
        rootAttr: resolvedRootAttr,
    });

    return {
        targetContainer,
        mountNode,
        portalContainer,
        portalClassName: portalClassName || `${pluginHandle}-ui`,
        translationCategory: resolvedTranslationCategory,
        shadowRootSelectors: [`[${resolvedRootAttr}]`],
    };
};

export const markContainerReady = (container, readyClassName) => {
    if (!container || !readyClassName) {
        return;
    }

    requestAnimationFrame(() => {
        setTimeout(() => {
            container.classList.add(readyClassName);
        }, 10);
    });
};

export const injectDocumentStyleText = (cssText, styleId) => {
    if (!cssText || !styleId || document.querySelector(`style[data-metrix-style-id="${styleId}"]`)) {
        return;
    }

    const style = document.createElement('style');
    style.setAttribute('data-metrix-style-id', styleId);
    style.textContent = cssText;
    document.head.appendChild(style);
};

/**
 * Craft CP templates call `new Craft.Metrix.SomeEntry(settings)` — async functions are not
 * valid constructors, so expose a sync wrapper and run async bootstrap inside.
 */
export const defineMetrixCpConstructor = (name, runner) => {
    const Constructor = function Constructor(settings) {
        void runner(settings);
    };

    Craft.Metrix[name] = Constructor;

    return Constructor;
};
