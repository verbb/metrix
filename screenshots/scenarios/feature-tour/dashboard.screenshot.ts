import { defineScreenshotScenario } from '@verbb/craft-screenshots/api';

import { seedMetrixFixture } from '../../support/fixtures';

let dashboardRoute = '/admin/metrix/dashboard?view=overview';

export default defineScreenshotScenario({
    id: 'metrix-feature-tour-dashboard',
    output: 'feature-tour/metrix-dashboard.png',
    route: () => dashboardRoute,
    viewport: { width: 1440, height: 1100, deviceScaleFactor: 2 },
    async setup(context) {
        const fixture = await seedMetrixFixture(context);
        dashboardRoute = fixture.dashboardRoute;
    },
    waitFor: [
        { type: 'loadState', state: 'networkidle' },
        { type: 'selector', selector: '.metrix-dashboard', state: 'visible', timeout: 30000 },
        { type: 'text', text: 'Active users' },
        { type: 'text', text: 'Operating system' },
    ],
    steps: [
        { type: 'wait', waitFor: { type: 'timeout', ms: 900 } },
    ],
    target: {
        type: 'selector',
        selector: '.metrix-dashboard',
        padding: 12,
    },
    caption: 'A real Metrix dashboard combining live, summary and breakdown widgets in Craft 5.',
    intent: 'Show the useful analytics overview editors can work with without leaving the control panel.',
});
