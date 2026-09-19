import { defineScreenshotScenario } from '@verbb/craft-screenshots/api';

import { seedMetrixFixture } from '../../support/fixtures';

let dashboardRoute = '/admin/metrix/dashboard?view=overview';

export default defineScreenshotScenario({
    id: 'metrix-feature-tour-widget-settings',
    output: 'feature-tour/metrix-widget-settings.png',
    route: () => dashboardRoute,
    viewport: { width: 1280, height: 1000, deviceScaleFactor: 2 },
    async setup(context) {
        const fixture = await seedMetrixFixture(context);
        dashboardRoute = fixture.dashboardRoute;
    },
    waitFor: [
        { type: 'loadState', state: 'networkidle' },
        { type: 'selector', selector: '.metrix-dashboard .pane', state: 'visible', timeout: 30000 },
        { type: 'text', text: 'Sessions' },
    ],
    steps: [
        { type: 'click', selector: '.metrix-dashboard .mc-grid > div:first-child .pane button[class*="mc-border-transparent"]' },
        { type: 'wait', waitFor: { type: 'selector', selector: '[role="menu"]', state: 'visible' } },
        {
            type: 'evaluate',
            expression: `[...document.querySelectorAll('[role="menuitem"]')].find((item) => item.textContent?.trim() === 'Settings')?.click()`,
        },
        { type: 'wait', waitFor: { type: 'selector', selector: '[role="dialog"]', state: 'visible' } },
        { type: 'wait', waitFor: { type: 'text', text: 'Widget Settings' } },
        { type: 'evaluate', expression: 'document.activeElement?.blur()' },
        { type: 'wait', waitFor: { type: 'timeout', ms: 250 } },
    ],
    target: {
        type: 'selector',
        selector: '[role="dialog"]',
        padding: 12,
    },
    caption: 'A real Metrix widget settings dialog using the configured source, metric, period and width.',
    intent: 'Document the individual controls available when tuning a dashboard widget.',
});
