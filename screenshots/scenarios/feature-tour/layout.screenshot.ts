import { defineScreenshotScenario } from '@verbb/craft-screenshots/api';

import { seedMetrixFixture } from '../../support/fixtures';

let dashboardRoute = '/admin/metrix/dashboard?view=overview';

export default defineScreenshotScenario({
    id: 'metrix-feature-tour-layout',
    output: 'feature-tour/metrix-widget-layout.png',
    route: () => dashboardRoute,
    viewport: { width: 1280, height: 1000, deviceScaleFactor: 2 },
    async setup(context) {
        const fixture = await seedMetrixFixture(context);
        dashboardRoute = fixture.dashboardRoute;
    },
    waitFor: [
        { type: 'loadState', state: 'networkidle' },
        { type: 'selector', selector: '.metrix-dashboard', state: 'visible', timeout: 30000 },
        { type: 'text', text: 'Operating system' },
    ],
    steps: [
        {
            type: 'evaluate',
            expression: `document.querySelector('.metrix-dashboard > div > header button[aria-label="Settings"]')?.click()`,
        },
        { type: 'wait', waitFor: { type: 'selector', selector: '[data-radix-popper-content-wrapper]', state: 'visible' } },
        {
            type: 'evaluate',
            expression: `
                document.activeElement?.blur();

                const wrapper = document.querySelector('[data-radix-popper-content-wrapper]');
                wrapper.style.background = '#fff';
                wrapper.style.borderRadius = '12px';
            `,
        },
        { type: 'wait', waitFor: { type: 'timeout', ms: 250 } },
    ],
    target: {
        type: 'selector',
        selector: '[data-radix-popper-content-wrapper]',
        padding: 0,
    },
    caption: 'Metrix’s genuine layout controls for resizing, reordering and removing dashboard widgets.',
    intent: 'Show how a dashboard can be shaped visually without leaving its live view.',
});
