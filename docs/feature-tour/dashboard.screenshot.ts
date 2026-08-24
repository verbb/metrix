import { defineScreenshotScenario } from '@verbb/docs-screenshots/api';
import { seedMetrixDocsFixture } from '../.screenshots/metrix/fixtures';
import { createMetrixCleanupStep } from '../.screenshots/metrix/presets';

// Starter scenario — captures the Metrix dashboard. On a fresh install this shows the
// empty-state; seed sources/views/widgets in metrix/fixtures.ts (Phase 1) for a populated
// dashboard, and retarget the selector at the React app's shadow host as needed.
let dashboardRoute = '/admin/metrix';

export default defineScreenshotScenario({
    id: 'feature-tour-dashboard',
    output: '_screenshots/feature-tour/dashboard.png',
    route: () => dashboardRoute,
    viewport: {
        width: 1320,
        height: 820,
        deviceScaleFactor: 2,
    },
    async setup(context) {
        const fixture = await seedMetrixDocsFixture(context);
        dashboardRoute = fixture.dashboardRoute;
    },
    waitFor: [
        { type: 'selector', selector: '#content', state: 'visible' },
    ],
    preSteps: [
        createMetrixCleanupStep(),
    ],
    steps: [],
    target: {
        type: 'selector',
        selector: '#content',
        padding: 20,
    },
    caption: 'The Metrix analytics dashboard.',
    intent: 'Show the dashboard with widgets and charts.',
});
