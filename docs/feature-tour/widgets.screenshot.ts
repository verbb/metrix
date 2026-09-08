import { defineScreenshotScenario } from '@verbb/docs-screenshots/api';
import { seedMetrixDocsFixture } from '../.screenshots/metrix/fixtures';
import {
    createPrepareMetrixPresetWidgetsSteps,
} from '../.screenshots/metrix/presets';

let presetEditRoute = '/admin/metrix/settings/presets';

export default defineScreenshotScenario({
    id: 'feature-tour-widgets',
    output: '_screenshots/feature-tour/widgets.png',
    route: () => presetEditRoute,
    viewport: {
        width: 1100,
        height: 900,
        deviceScaleFactor: 2,
    },
    async setup(context) {
        const fixture = await seedMetrixDocsFixture(context);
        if (!fixture.presetEditRoute) {
            throw new Error('Metrix docs fixture missing presetEditRoute.');
        }
        presetEditRoute = fixture.presetEditRoute;
    },
    waitFor: [
        { type: 'selector', selector: '#tabs', state: 'visible', timeout: 60000 },
        { type: 'selector', selector: '.metrix-presets, #widgets', state: 'attached', timeout: 60000 },
    ],
    preSteps: [
        // Light cleanup only — full Metrix cleanup shifts #content to negative x.
        {
            type: 'evaluate',
            expression: `
                (() => {
                    const style = document.createElement('style');
                    style.id = 'metrix-docs-widgets-light-cleanup';
                    style.textContent = [
                        'craft-global-sidebar, footer#global-footer { display: none !important; }',
                        'html, body { background: #f3f7fc !important; }',
                        'html, body, * { scrollbar-width: none !important; }',
                    ].join('\\n');
                    document.head.appendChild(style);
                    window.scrollTo(0, 0);
                })();
            `,
        },
        { type: 'wait', waitFor: { type: 'timeout', ms: 800 } },
        ...createPrepareMetrixPresetWidgetsSteps(),
        {
            type: 'wait',
            waitFor: {
                type: 'selector',
                selector: '#metrix-docs-screenshot-stage',
                state: 'visible',
                timeout: 15000,
            },
        },
    ],
    steps: [],
    target: {
        type: 'selector',
        selector: '#metrix-docs-screenshot-stage',
        padding: 0,
    },
    caption: 'Widgets tab on a preset with line, counter, pie, and table widgets.',
    intent: 'Show Settings → Presets → Widgets (not the dashboard gear popover).',
});
