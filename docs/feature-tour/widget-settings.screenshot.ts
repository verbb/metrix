import { defineScreenshotScenario } from '@verbb/docs-screenshots/api';
import { seedMetrixDocsFixture } from '../.screenshots/metrix/fixtures';
import {
    createFrameMetrixWidgetSettingsSteps,
    createMetrixCleanupStep,
    createOpenFirstWidgetSettingsSteps,
} from '../.screenshots/metrix/presets';

let dashboardRoute = '/admin/metrix';

export default defineScreenshotScenario({
    id: 'feature-tour-widget-settings',
    output: '_screenshots/feature-tour/widget-settings.png',
    route: () => dashboardRoute,
    // Tall enough that an unlocked dialog body is not viewport-clipped.
    viewport: {
        width: 1100,
        height: 1100,
        deviceScaleFactor: 2,
    },
    async setup(context) {
        const fixture = await seedMetrixDocsFixture(context);
        dashboardRoute = fixture.dashboardRoute;
    },
    waitFor: [
        {
            type: 'selector',
            selector: 'pk-dialog.metrix-widget-settings-dialog',
            state: 'attached',
            timeout: 60000,
        },
    ],
    preSteps: [
        createMetrixCleanupStep(),
        { type: 'wait', waitFor: { type: 'timeout', ms: 1200 } },
        ...createOpenFirstWidgetSettingsSteps(),
        {
            type: 'wait',
            waitFor: {
                type: 'selector',
                selector: '.metrix-widget-settings-form',
                state: 'visible',
                timeout: 30000,
            },
        },
        ...createFrameMetrixWidgetSettingsSteps(),
        {
            type: 'wait',
            waitFor: {
                type: 'selector',
                selector: '#metrix-docs-screenshot-stage',
                state: 'visible',
                timeout: 10000,
            },
        },
    ],
    steps: [],
    target: {
        type: 'selector',
        selector: '#metrix-docs-screenshot-stage',
        padding: 0,
    },
    caption: 'Widget settings for source, chart type, width, period, and metric.',
    intent: 'Show the Widget Settings modal flush — full panel including footer.',
});
