import { defineScreenshotScenario } from '@verbb/docs-screenshots/api';
import { seedMetrixDocsFixture } from '../.screenshots/metrix/fixtures';
import {
    createMetrixCleanupStep,
    createOpenLayoutSettingsSteps,
} from '../.screenshots/metrix/presets';

let dashboardRoute = '/admin/metrix';

export default defineScreenshotScenario({
    id: 'feature-tour-dashboard-settings',
    output: '_screenshots/feature-tour/dashboard-settings.png',
    route: () => dashboardRoute,
    viewport: {
        width: 1320,
        height: 900,
        deviceScaleFactor: 2,
    },
    async setup(context) {
        const fixture = await seedMetrixDocsFixture(context);
        dashboardRoute = fixture.dashboardRoute;
    },
    waitFor: [
        { type: 'selector', selector: '.metrix-dashboard--ready', state: 'visible', timeout: 60000 },
        { type: 'selector', selector: '#metrix-docs-screenshot-stage', state: 'visible', timeout: 60000 },
    ],
    preSteps: [
        createMetrixCleanupStep(),
        // Charts behind the popover — give them a beat so the wash isn’t empty.
        { type: 'wait', waitFor: { type: 'timeout', ms: 1200 } },
        ...createOpenLayoutSettingsSteps(),
    ],
    steps: [],
    target: {
        type: 'selector',
        selector: '#metrix-docs-screenshot-stage',
        padding: 0,
    },
    caption: 'Dashboard settings panel listing widgets for the current view.',
    intent: 'Show the layout/settings popover for dashboard widgets.',
});
