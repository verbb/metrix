import type {
    ScreenshotStep,
    ScreenshotTarget,
    ScreenshotViewport,
} from '@verbb/docs-screenshots/types';
import {
    createCpDetailViewPreset as createBaseCpDetailViewPreset,
    createCpFocusedRegionPreset as createBaseCpFocusedRegionPreset,
    createCpFullScreenPreset as createBaseCpFullScreenPreset,
    createCpModalPreset as createBaseCpModalPreset,
} from '@verbb/docs-screenshots/presets';

// Plugin-local preset layer. Generic capture math lives in @verbb/docs-screenshots;
// this file only adds Metrix-specific CP chrome cleanup + framing steps. Metrix renders
// React apps inside shadow roots (Phase 1) — when adding crop steps, remember selectors may
// need to pierce the shadow host. Model richer promo steps on Hyper's presets.ts.

type CpPresetOptions = {
    selector?: string;
    viewport?: ScreenshotViewport;
    padding?: NonNullable<Extract<ScreenshotTarget, { type: 'selector' }>['padding']>;
    hidePlaceholder?: boolean;
};

/** Craft CP page wash — use when the shot should read as in-CP, not a cutout. */
export const METRIX_CP_GRAY = '#f3f7fc';

const scrollResetSelectors = [
    'html',
    'body',
    '#content-container',
    '#main-content',
    '#content',
    '.content-pane',
];

function buildCleanupCss({ hidePlaceholder = true }: { hidePlaceholder?: boolean }): string {
    const rules = [
        'craft-global-sidebar, footer#global-footer { display: none !important; }',
        'craft-global-sidebar { width: 0 !important; min-width: 0 !important; flex: 0 0 0 !important; }',
        '#global-header * { display: none !important; }',
        '#details-container { position: static !important; }',
        'body.fixed-header #header { position: static !important; top: auto !important; }',
        'body.fixed-header #content-container { padding-top: 0 !important; }',
        '#content-container, #main-content, #content { max-width: none !important; }',
        '#content-container { padding: 24px !important; }',
        '#main-content { padding-top: 0 !important; }',
        '#page-container, #content-container, #main-content, #content, .content-pane { left: 0 !important; margin-left: 0 !important; }',
        'html, body, * { scrollbar-width: none !important; -ms-overflow-style: none !important; }',
        'html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }',
    ];

    if (hidePlaceholder) {
        rules.push('.cp-placeholder, .placeholder { display: none !important; }');
    }

    return rules.join('\n');
}

/** Strip Craft chrome (global sidebar/header/footer, scrollbars) for focused dashboard crops. */
export function createMetrixCleanupStep({ hidePlaceholder = true }: { hidePlaceholder?: boolean } = {}): ScreenshotStep {
    const css = buildCleanupCss({ hidePlaceholder });

    return {
        type: 'evaluate',
        expression: `
            (() => {
                const styleId = 'metrix-docs-screenshot-cleanup';
                let style = document.getElementById(styleId);

                if (!(style instanceof HTMLStyleElement)) {
                    style = document.createElement('style');
                    style.id = styleId;
                    document.head.appendChild(style);
                }

                style.textContent = ${JSON.stringify(css)};

                ${JSON.stringify(scrollResetSelectors)}.forEach((selector) => {
                    document.querySelectorAll(selector).forEach((element) => {
                        if (element instanceof HTMLElement) {
                            element.scrollTop = 0;
                            element.scrollLeft = 0;
                        }
                    });
                });

                window.scrollTo(0, 0);
            })();
        `,
    };
}

/** Open the first widget’s Settings dialog. Pierces Metrix + PK shadow trees. */
export function createOpenFirstWidgetSettingsSteps(): ScreenshotStep[] {
    return [
        {
            type: 'evaluate',
            expression: `
                (() => {
                    const queryAllDeep = (selector, root = document) => {
                        const out = [];
                        const visit = (node) => {
                            if (!node) return;
                            if (node.querySelectorAll) {
                                out.push(...node.querySelectorAll(selector));
                            }
                            const elements = node.querySelectorAll ? node.querySelectorAll('*') : [];
                            for (const el of elements) {
                                if (el.shadowRoot) visit(el.shadowRoot);
                            }
                        };
                        visit(root);
                        return out;
                    };

                    const host = document.querySelector('.metrix-dashboard');
                    const roots = [document, host?.shadowRoot].filter(Boolean);
                    let trigger = null;
                    for (const root of roots) {
                        trigger = queryAllDeep('.metrix-widget-menu-trigger', root)[0] || null;
                        if (trigger) break;
                    }
                    if (!(trigger instanceof HTMLElement)) {
                        throw new Error('No widget menu trigger found.');
                    }
                    trigger.click();
                    return true;
                })();
            `,
        },
        { type: 'wait', waitFor: { type: 'timeout', ms: 400 } },
        {
            type: 'evaluate',
            expression: `
                (() => {
                    const queryAllDeep = (selector, root = document) => {
                        const out = [];
                        const visit = (node) => {
                            if (!node) return;
                            if (node.querySelectorAll) {
                                out.push(...node.querySelectorAll(selector));
                            }
                            const elements = node.querySelectorAll ? node.querySelectorAll('*') : [];
                            for (const el of elements) {
                                if (el.shadowRoot) visit(el.shadowRoot);
                            }
                        };
                        visit(root);
                        return out;
                    };

                    const items = queryAllDeep('pk-dropdown-item, [role="menuitem"]');
                    const settings = items.find((el) => (el.textContent || '').trim().toLowerCase() === 'settings');
                    if (!(settings instanceof HTMLElement)) {
                        const labels = items.map((el) => (el.textContent || '').trim()).filter(Boolean).slice(0, 12);
                        throw new Error('Widget Settings menu item not found. Saw: ' + labels.join(' | '));
                    }
                    settings.click();
                    return true;
                })();
            `,
        },
        { type: 'wait', waitFor: { type: 'timeout', ms: 700 } },
    ];
}

/**
 * Frame the open Widget Settings pk-dialog for a flush cutout.
 * Crops the dialog panel (header + body + footer), not the form alone —
 * form bbox is clipped by the scroll body and padding:N leaves CP wash L/R.
 */
export function createFrameMetrixWidgetSettingsSteps(): ScreenshotStep[] {
    return [
        {
            type: 'evaluate',
            expression: `
                (() => {
                    const queryAllDeep = (selector, root = document) => {
                        const out = [];
                        const visit = (node) => {
                            if (!node?.querySelectorAll) return;
                            out.push(...node.querySelectorAll(selector));
                            for (const el of node.querySelectorAll('*')) {
                                if (el.shadowRoot) visit(el.shadowRoot);
                            }
                        };
                        visit(root);
                        return out;
                    };

                    document.getElementById('metrix-docs-screenshot-stage')?.remove();

                    const dialogs = queryAllDeep('pk-dialog.metrix-widget-settings-dialog');
                    const open = dialogs.find((el) => el.hasAttribute('open') || el.open === true);
                    if (!(open instanceof HTMLElement)) {
                        throw new Error('Open widget settings dialog not found. count=' + dialogs.length);
                    }

                    open.id = 'metrix-docs-widget-settings-dialog';
                    open.style.setProperty('opacity', '1', 'important');
                    open.style.setProperty('visibility', 'visible', 'important');

                    // Let the full form paint — body max-height clips Chart Type / Save in crops.
                    const styleId = 'metrix-docs-widget-settings-frame-css';
                    let style = document.getElementById(styleId);
                    if (!(style instanceof HTMLStyleElement)) {
                        style = document.createElement('style');
                        style.id = styleId;
                        document.head.appendChild(style);
                    }
                    style.textContent = [
                        '#metrix-docs-widget-settings-dialog::part(panel) {',
                        '  max-height: none !important;',
                        // Flush crop sits exactly on the panel edge, so rounded corners
                        // would leak backdrop wedges into the four corners of the PNG.
                        '  border-radius: 0 !important;',
                        '  box-shadow: none !important;',
                        '}',
                        '#metrix-docs-widget-settings-dialog::part(body) {',
                        '  max-height: none !important;',
                        '  overflow: visible !important;',
                        '}',
                        // Keep the cutout wash consistent with other Metrix docs shots.
                        'html, body, #page-container, #content-container, #main, #content {',
                        '  background: ${METRIX_CP_GRAY} !important;',
                        '}',
                    ].join('\\n');

                    // Hide the dashboard so only the dialog reads on the CP wash.
                    const host = document.querySelector('.metrix-dashboard');
                    if (host instanceof HTMLElement) {
                        host.style.setProperty('opacity', '0', 'important');
                    }

                    const panel =
                        open.shadowRoot?.querySelector('[part="panel"], .panel, dialog')
                        || open;

                    if (!(panel instanceof HTMLElement)) {
                        throw new Error('Widget settings dialog panel not found.');
                    }

                    const form = open.querySelector('.metrix-widget-settings-form')
                        || queryAllDeep('.metrix-widget-settings-form')[0];
                    if (!(form instanceof HTMLElement)) {
                        throw new Error('Widget settings form missing inside dialog.');
                    }

                    const footerBtns = open.querySelectorAll('[slot="footer"]');
                    if (!footerBtns.length) {
                        throw new Error('Widget settings footer buttons missing.');
                    }

                    // Wait two frames so unlocked max-height lays out before we measure.
                    return new Promise((resolve) => {
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                // Crop flush to the panel border — no backdrop margin.
                                const box = panel.getBoundingClientRect();
                                const left = Math.max(0, Math.round(box.left));
                                const top = Math.max(0, Math.round(box.top));
                                const right = Math.round(box.right);
                                const bottom = Math.round(box.bottom);

                                const stage = document.createElement('div');
                                stage.id = 'metrix-docs-screenshot-stage';
                                stage.style.cssText = [
                                    'position:fixed',
                                    'left:' + left + 'px',
                                    'top:' + top + 'px',
                                    'width:' + Math.max(1, right - left) + 'px',
                                    'height:' + Math.max(1, bottom - top) + 'px',
                                    'pointer-events:none',
                                    'z-index:2147483640',
                                    'background:transparent',
                                    'box-sizing:border-box',
                                ].join(';');
                                document.body.appendChild(stage);
                                resolve(true);
                            });
                        });
                    });
                })();
            `,
        },
        { type: 'wait', waitFor: { type: 'timeout', ms: 300 } },
    ];
}

/** Open dashboard layout settings popover (gear + widget list) and frame an in-place crop.
 *  Keeps the live pk-popover (arrow, shadow, WidthPicker / drag / remove) over the dashboard —
 *  do not reparent into a fake card (that stripped chrome and broke row actions).
 */
export function createOpenLayoutSettingsSteps(): ScreenshotStep[] {
    return [
        {
            type: 'evaluate',
            expression: `
                (() => {
                    const host = document.querySelector('.metrix-dashboard');
                    const root = host?.shadowRoot ?? document;
                    const trigger = root.querySelector('.metrix-layout-settings-trigger');
                    if (!(trigger instanceof HTMLElement)) {
                        throw new Error('Layout settings trigger not found.');
                    }
                    trigger.click();
                })();
            `,
        },
        {
            type: 'wait',
            waitFor: {
                type: 'selector',
                selector: '.metrix-layout-settings-panel .metrix-layout-settings-row',
                state: 'attached',
                timeout: 30000,
            },
        },
        { type: 'wait', waitFor: { type: 'timeout', ms: 500 } },
        // Transparent measurement stage — page.screenshot clip uses this bbox, so the
        // live dashboard + popover underneath are what get written to the PNG.
        {
            type: 'evaluate',
            expression: `
                (() => {
                    document.getElementById('metrix-docs-screenshot-stage')?.remove();

                    const host = document.querySelector('.metrix-dashboard');
                    const roots = [document, host?.shadowRoot].filter(Boolean);

                    const query = (selector) => {
                        for (const root of roots) {
                            const el = root.querySelector(selector);
                            if (el) return el;
                        }
                        return null;
                    };

                    const trigger = query('.metrix-layout-settings-trigger');
                    const panel = query('.metrix-layout-settings-panel');
                    const popover = query('.metrix-layout-settings-popover');

                    if (!(trigger instanceof HTMLElement) || !(panel instanceof HTMLElement)) {
                        throw new Error('Layout settings trigger/panel not found for crop.');
                    }

                    // Prefer the popover panel part (includes arrow + shadow), fall back to light DOM.
                    let chrome = panel;
                    if (popover instanceof HTMLElement) {
                        const part = popover.shadowRoot?.querySelector('[part="panel"], .panel');
                        if (part instanceof HTMLElement) {
                            chrome = part;
                        }
                    }

                    const triggerBox = trigger.getBoundingClientRect();
                    const chromeBox = chrome.getBoundingClientRect();
                    // Screen-3 style: tight to gear + popover on flat CP wash (not a wide dashboard plate).
                    const pad = { top: 10, right: 10, bottom: 14, left: 14 };
                    const left = Math.min(chromeBox.left, triggerBox.left) - pad.left;
                    const top = Math.min(chromeBox.top, triggerBox.top) - pad.top;
                    const right = Math.max(chromeBox.right, triggerBox.right) + pad.right;
                    const bottom = Math.max(chromeBox.bottom, triggerBox.bottom) + pad.bottom;

                    // Flat wash: hide widget cards so the crop reads on CP gray (screen 3),
                    // without opacity:0 on the host (popover lives in that tree).
                    const dashRoot = host?.shadowRoot ?? document;
                    for (const pane of dashRoot.querySelectorAll('.pane')) {
                        if (pane instanceof HTMLElement) {
                            pane.style.setProperty('visibility', 'hidden', 'important');
                        }
                    }
                    const styleId = 'metrix-docs-layout-settings-wash';
                    let washStyle = document.getElementById(styleId);
                    if (!(washStyle instanceof HTMLStyleElement)) {
                        washStyle = document.createElement('style');
                        washStyle.id = styleId;
                        document.head.appendChild(washStyle);
                    }
                    washStyle.textContent = [
                        'html, body, #page-container, #content-container, #main, #content, .content-pane {',
                        '  background: ${METRIX_CP_GRAY} !important;',
                        '}',
                    ].join('\\n');

                    const stage = document.createElement('div');
                    stage.id = 'metrix-docs-screenshot-stage';
                    stage.style.cssText = [
                        'position:fixed',
                        'left:' + Math.max(0, left) + 'px',
                        'top:' + Math.max(0, top) + 'px',
                        'width:' + Math.ceil(right - left) + 'px',
                        'height:' + Math.ceil(bottom - top) + 'px',
                        'pointer-events:none',
                        'z-index:2147483640',
                        'background:transparent',
                        'box-sizing:border-box',
                    ].join(';');
                    document.body.appendChild(stage);

                    // Sanity: rows should still be in-tree with action controls.
                    const rows = panel.querySelectorAll('.metrix-layout-settings-row');
                    const actions = panel.querySelectorAll('.metrix-layout-settings-row__actions');
                    if (!rows.length) {
                        throw new Error('Layout settings rows missing after open.');
                    }
                    if (!actions.length) {
                        throw new Error('Layout settings row actions missing — panel may have been stripped.');
                    }
                })();
            `,
        },
    ];
}

/** Seeded widget order — keep in sync with seed-docs-dashboard.php. */
export const METRIX_DOCS_WIDGET_SLUGS = [
    'sessions-line',
    'active-users',
    'sessions-counter',
    'browser-pie',
    'os-table',
    'country-table',
] as const;

export type MetrixDocsWidgetSlug = (typeof METRIX_DOCS_WIDGET_SLUGS)[number];

/**
 * Stamp stable ids on each dashboard `.pane` (seed order) and hide every other
 * card so a selector clip cannot pick up neighboring widgets (grid overlap /
 * motion layout).
 */
export function createIsolateMetrixWidgetPaneStep(slug: MetrixDocsWidgetSlug): ScreenshotStep {
    const slugJson = JSON.stringify(slug);
    const slugsJson = JSON.stringify(METRIX_DOCS_WIDGET_SLUGS);

    return {
        type: 'evaluate',
        expression: `
            (() => {
                const host = document.querySelector('.metrix-dashboard');
                const root = host?.shadowRoot ?? document;
                const panes = Array.from(root.querySelectorAll('.pane'));
                const slugs = ${slugsJson};
                const slug = ${slugJson};

                if (panes.length < slugs.length) {
                    throw new Error(
                        'Expected ' + slugs.length + ' widget panes, found ' + panes.length,
                    );
                }

                let target = null;
                slugs.forEach((itemSlug, index) => {
                    const pane = panes[index];
                    if (!(pane instanceof HTMLElement)) {
                        throw new Error('Missing pane for slug ' + itemSlug);
                    }
                    pane.id = 'metrix-docs-widget-' + itemSlug;
                    pane.style.setProperty('border-radius', '4px', 'important');
                    pane.style.setProperty('margin', '0', 'important');

                    const cell = pane.parentElement;
                    if (itemSlug === slug) {
                        target = pane;
                        if (cell instanceof HTMLElement) {
                            cell.style.setProperty('visibility', 'visible', 'important');
                        }
                    } else if (cell instanceof HTMLElement) {
                        // Hide the grid cell — visibility keeps layout so the target bbox stays put.
                        cell.style.setProperty('visibility', 'hidden', 'important');
                    }
                });

                if (!(target instanceof HTMLElement)) {
                    throw new Error('Target widget pane not found for ' + slug);
                }

                // Header / actions are noise for a single-card cutout.
                root.querySelectorAll('header, .metrix-layout-settings-popover').forEach((el) => {
                    if (el instanceof HTMLElement) {
                        el.style.setProperty('visibility', 'hidden', 'important');
                    }
                });
            })();
        `,
    };
}

export function createCpFocusedRegionPreset(options: CpPresetOptions = {}) {
    const preset = createBaseCpFocusedRegionPreset(options);

    return {
        ...preset,
        steps: [
            createMetrixCleanupStep({ hidePlaceholder: options.hidePlaceholder }),
            ...preset.steps,
        ] satisfies ScreenshotStep[],
    };
}

export function createCpFullScreenPreset(options: CpPresetOptions = {}) {
    const preset = createBaseCpFullScreenPreset(options);

    return {
        ...preset,
        steps: [
            createMetrixCleanupStep({ hidePlaceholder: options.hidePlaceholder }),
            ...preset.steps,
        ] satisfies ScreenshotStep[],
    };
}

export function createCpModalPreset(options: CpPresetOptions = {}) {
    return createBaseCpModalPreset(options);
}

export function createCpDetailViewPreset(options: CpPresetOptions = {}) {
    const preset = createBaseCpDetailViewPreset(options);

    return {
        ...preset,
        steps: [
            createMetrixCleanupStep({ hidePlaceholder: options.hidePlaceholder }),
            ...preset.steps,
        ] satisfies ScreenshotStep[],
    };
}

/**
 * Open the Preset editor’s Widgets tab and frame the tabbed pane flush
 * (Preset | Widgets chrome + rows + New widget) for widgets.png.
 *
 * Reparents into a fixed on-screen stage — cleanup CSS can shove #content to
 * negative x, which clips titles out of Playwright’s viewport clip.
 */
export function createPrepareMetrixPresetWidgetsSteps(): ScreenshotStep[] {
    return [
        {
            type: 'evaluate',
            expression: `
                (() => {
                    const tab =
                        document.querySelector('#tabs a[href="#widgets"]')
                        || document.querySelector('#tabs a[data-id="widgets"]')
                        || [...document.querySelectorAll('#tabs a, #tabs button')].find(
                            (el) => (el.textContent || '').trim().toLowerCase() === 'widgets',
                        );

                    if (!(tab instanceof HTMLElement)) {
                        const labels = [...document.querySelectorAll('#tabs a, #tabs button')]
                            .map((el) => (el.textContent || '').trim())
                            .filter(Boolean);
                        throw new Error('Presets Widgets tab not found. tabs=' + labels.join('|'));
                    }
                    tab.click();

                    const pane = document.querySelector('#widgets');
                    if (pane instanceof HTMLElement) {
                        pane.classList.remove('hidden');
                        pane.style.display = '';
                    }
                })();
            `,
        },
        {
            type: 'wait',
            waitFor: {
                type: 'selector',
                selector: '.metrix-presets.metrix-presets--ready, .metrix-presets--ready',
                state: 'attached',
                timeout: 60000,
            },
        },
        { type: 'wait', waitFor: { type: 'timeout', ms: 800 } },
        {
            type: 'evaluate',
            expression: `
                (() => {
                    const queryAllDeep = (selector, root = document) => {
                        const out = [];
                        const visit = (node) => {
                            if (!node) return;
                            if (node.shadowRoot) visit(node.shadowRoot);
                            if (!node.querySelectorAll) return;
                            out.push(...node.querySelectorAll(selector));
                            for (const el of node.querySelectorAll('*')) {
                                if (el.shadowRoot) visit(el.shadowRoot);
                            }
                        };
                        visit(root);
                        return out;
                    };

                    document.getElementById('metrix-docs-screenshot-stage')?.remove();
                    document.documentElement.style.removeProperty('transform');

                    const tabs = document.querySelector('#tabs');
                    const widgetsPane = document.querySelector('#widgets');
                    const presetsHost = document.querySelector('#widgets .metrix-presets')
                        || document.querySelector('.metrix-presets');

                    if (!(tabs instanceof HTMLElement) || !(widgetsPane instanceof HTMLElement)) {
                        throw new Error('Preset tabs / #widgets pane missing.');
                    }
                    if (!(presetsHost instanceof HTMLElement)) {
                        throw new Error('.metrix-presets host missing.');
                    }

                    const rows = queryAllDeep('.metrix-preset-widget-row', presetsHost);
                    if (rows.length < 6) {
                        throw new Error(
                            'Expected ≥6 preset widget rows, found ' + rows.length
                            + '; hasShadow=' + Boolean(presetsHost.shadowRoot),
                        );
                    }

                    // Hide chrome that fights the cutout.
                    for (const sel of [
                        '#details-container', '#details', '#header', '#global-header',
                        'craft-global-sidebar', 'footer#global-footer', '#announcements',
                    ]) {
                        document.querySelectorAll(sel).forEach((el) => {
                            if (el instanceof HTMLElement) el.style.display = 'none';
                        });
                    }

                    // Fixed stage on-screen — move tabs + widgets pane (shadow host travels with it).
                    const stage = document.createElement('div');
                    stage.id = 'metrix-docs-screenshot-stage';
                    stage.style.cssText = [
                        'position:fixed',
                        'left:24px',
                        'top:24px',
                        'width:640px',
                        'max-width:calc(100vw - 48px)',
                        'background:${METRIX_CP_GRAY}',
                        'padding:12px',
                        'box-sizing:border-box',
                        'z-index:2147483640',
                        'overflow:visible',
                    ].join(';');

                    const card = document.createElement('div');
                    card.style.cssText = [
                        'background:#fff',
                        'border-radius:8px',
                        'border:1px solid rgba(0,0,0,0.08)',
                        'overflow:hidden',
                    ].join(';');

                    // Keep Craft tab styles working after move. The tab strip inherits
                    // its inset from #content on the real page; reparenting drops that,
                    // so the first tab renders flush and gets clipped by the card.
                    tabs.style.display = '';
                    tabs.style.margin = '0';
                    tabs.style.padding = '0 16px';
                    tabs.style.boxSizing = 'border-box';
                    // In the CP the strip sits on the page wash, which is what makes the
                    // selected tab read as a white cutout. The white card we reparent into
                    // erases that contrast, so restore the wash + divider explicitly.
                    tabs.style.background = '${METRIX_CP_GRAY}';
                    tabs.style.borderBottom = '1px solid rgba(0,0,0,0.08)';

                    const tabList = tabs.querySelector('ul, nav');
                    if (tabList instanceof HTMLElement) {
                        tabList.style.marginLeft = '0';
                        tabList.style.paddingLeft = '0';
                    }

                    widgetsPane.classList.remove('hidden');
                    widgetsPane.style.display = '';
                    widgetsPane.style.padding = '16px';

                    card.appendChild(tabs);
                    card.appendChild(widgetsPane);
                    stage.appendChild(card);
                    document.body.appendChild(stage);

                    // Size stage to the card after layout.
                    return new Promise((resolve) => {
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                const box = card.getBoundingClientRect();
                                stage.style.width = Math.ceil(box.width + 24) + 'px';
                                stage.style.height = Math.ceil(box.height + 24) + 'px';
                                resolve(true);
                            });
                        });
                    });
                })();
            `,
        },
        { type: 'wait', waitFor: { type: 'timeout', ms: 300 } },
    ];
}

/**
 * Prepare the Sources index for a flush table cutout (screen-2 style).
 * Hides the docs Demo Analytics row (widgets still use it) and strips empty
 * chrome below the table so the crop is row-tight.
 */
export function createPrepareMetrixSourcesIndexStep(): ScreenshotStep {
    return {
        type: 'evaluate',
        expression: `
            (() => {
                const root = document.querySelector('#sources-vue-admin-table');
                if (!(root instanceof HTMLElement)) {
                    throw new Error('Sources VueAdminTable root not found.');
                }

                const table = root.querySelector('table');
                if (!(table instanceof HTMLTableElement)) {
                    throw new Error('Sources table not found.');
                }

                // Demo Analytics powers widget fixtures — drop it from this cutout only.
                const hideHandles = new Set(['docsDemoAnalytics']);
                for (const row of table.querySelectorAll('tbody tr')) {
                    const handleText = (row.textContent || '');
                    for (const handle of hideHandles) {
                        if (handleText.includes(handle)) {
                            row.style.display = 'none';
                        }
                    }
                }

                const visibleRows = [...table.querySelectorAll('tbody tr')].filter(
                    (row) => row instanceof HTMLElement && row.style.display !== 'none',
                );
                if (visibleRows.length < 6) {
                    throw new Error(
                        'Expected at least 6 showcase source rows, found ' + visibleRows.length,
                    );
                }

                // DOM safety net: force Enabled / Connected badges if seed connected
                // state did not round-trip (e.g. OAuth token lookup edge cases).
                for (const row of visibleRows) {
                    const cells = row.querySelectorAll('td');
                    // Columns: Name, Handle, Status, Connected, Provider, actions…
                    for (const idx of [2, 3]) {
                        const cell = cells[idx];
                        if (!(cell instanceof HTMLElement)) continue;
                        if (cell.querySelector('.status.on')) continue;
                        const label = idx === 2 ? 'Enabled' : 'Connected';
                        cell.innerHTML =
                            '<span class="status on"></span>' + label;
                    }
                }

                const styleId = 'metrix-docs-sources-index-css';
                let style = document.getElementById(styleId);
                if (!(style instanceof HTMLStyleElement)) {
                    style = document.createElement('style');
                    style.id = styleId;
                    document.head.appendChild(style);
                }

                style.textContent = [
                    '#content-container { padding: 0 !important; }',
                    // Shrink-wrap the wrappers so the crop ends at the Provider column
                    // rather than trailing the empty content pane on the right.
                    '#sources-vue-admin-table, #sources-vue-admin-table .vue-admin-table__table-wrapper, #sources-vue-admin-table .dataTables_wrapper { height: auto !important; min-height: 0 !important; overflow: visible !important; width: max-content !important; max-width: none !important; }',
                    '#content, .content-pane { min-height: 0 !important; height: auto !important; overflow: visible !important; }',
                    // Drop reorder/delete columns — they are empty chrome in a docs cutout.
                    '#sources-vue-admin-table table.data thead tr th:nth-last-child(-n+2),',
                    '#sources-vue-admin-table table.data tbody tr td:nth-last-child(-n+2) { display: none !important; }',
                    // Auto layout + max-content sizes each column to its own text, so
                    // nothing is clipped and no dead space trails the last column.
                    // White base: the pane behind the table is narrower than the widened
                    // table, so transparent rows would expose the CP wash on the right.
                    '#sources-vue-admin-table table.data { table-layout: auto !important; width: max-content !important; min-width: 0 !important; max-width: none !important; background: #fff !important; }',
                    '#sources-vue-admin-table table.data th,',
                    '#sources-vue-admin-table table.data td { padding-left: 15px !important; padding-right: 15px !important; white-space: nowrap !important; }',
                    // Capture runs with a live cursor over the table; kill hover/selected
                    // tints so no single row reads as highlighted in the docs shot.
                    '#sources-vue-admin-table table.data tbody tr,',
                    '#sources-vue-admin-table table.data tbody tr:hover,',
                    '#sources-vue-admin-table table.data tbody tr.sel,',
                    '#sources-vue-admin-table table.data tbody tr:hover td,',
                    '#sources-vue-admin-table table.data tbody tr td { background-color: transparent !important; }',
                ].join('\\n');

                for (const row of table.querySelectorAll('tbody tr')) {
                    row.classList.remove('sel', 'hover');
                }

                // The CP nests the table in several fixed-width / overflow-hidden panes.
                // Walk the real ancestor chain and unclip it so the widened table paints
                // in full — selector guesses miss whichever wrapper actually clips.
                for (let node = table.parentElement; node && node !== document.body; node = node.parentElement) {
                    node.style.setProperty('overflow', 'visible', 'important');
                    node.style.setProperty('max-width', 'none', 'important');
                    node.style.setProperty('width', 'max-content', 'important');
                }

                // Collapse leftover empty pane height under the table.
                root.style.height = 'auto';
                root.style.minHeight = '0';
                root.style.overflow = 'visible';
                const pane = root.closest('.content-pane, #content');
                if (pane instanceof HTMLElement) {
                    pane.style.minHeight = '0';
                    pane.style.height = 'auto';
                }
            })();
        `,
    };
}
