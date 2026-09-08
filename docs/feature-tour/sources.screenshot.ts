import { defineScreenshotScenario } from '@verbb/docs-screenshots/api';
import { seedMetrixDocsFixture } from '../.screenshots/metrix/fixtures';
import {
    createMetrixCleanupStep,
    createPrepareMetrixSourcesIndexStep,
} from '../.screenshots/metrix/presets';

let sourcesRoute = '/admin/metrix/sources';

export default defineScreenshotScenario({
    id: 'feature-tour-sources',
    output: '_screenshots/feature-tour/sources.png',
    route: () => sourcesRoute,
    // Wide enough for the admin table; short so the flush crop stays row-tight
    // like the classic ~1024×298 screen-2 cutout (captured @2x).
    viewport: {
        width: 1100,
        height: 520,
        deviceScaleFactor: 2,
    },
    async setup(context) {
        const fixture = await seedMetrixDocsFixture(context);
        sourcesRoute = fixture.sourcesRoute;
    },
    waitFor: [
        { type: 'selector', selector: '#sources-vue-admin-table', state: 'visible', timeout: 30000 },
        { type: 'selector', selector: '#sources-vue-admin-table table tbody tr', state: 'visible', timeout: 30000 },
    ],
    preSteps: [
        createMetrixCleanupStep(),
        createPrepareMetrixSourcesIndexStep(),
        { type: 'wait', waitFor: { type: 'timeout', ms: 200 } },
    ],
    steps: [],
    // Crop the table itself — no #content padding / empty pane wash.
    target: {
        type: 'selector',
        selector: '#sources-vue-admin-table table',
        padding: 0,
    },
    caption: 'Metrix Sources index with connected analytics providers.',
    intent: 'Show the Sources index with six enabled, connected providers matching the classic cutout.',
});
