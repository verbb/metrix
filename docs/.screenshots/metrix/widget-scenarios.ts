import { defineScreenshotScenario } from '@verbb/docs-screenshots/api';

import { seedMetrixDocsFixture } from './fixtures';
import {
    createMetrixCleanupStep,
    createIsolateMetrixWidgetPaneStep,
    type MetrixDocsWidgetSlug,
} from './presets';

type MetrixWidgetScenarioOptions = {
    slug: MetrixDocsWidgetSlug;
    caption: string;
    intent: string;
};

/**
 * One scenario = one seeded dashboard widget card, cropped flush for manual
 * dashboard composites (see feature-tour/dashboard.md).
 */
export function defineMetrixWidgetScenario({
    slug,
    caption,
    intent,
}: MetrixWidgetScenarioOptions) {
    let dashboardRoute = '/admin/metrix';

    return defineScreenshotScenario({
        id: `feature-tour-widget-${slug}`,
        output: `_screenshots/feature-tour/widget-${slug}.png`,
        route: () => dashboardRoute,
        // Near the classic docs cutout width so card proportions match screen-2.
        viewport: {
            width: 1100,
            height: 900,
            deviceScaleFactor: 2,
        },
        async setup(context) {
            const fixture = await seedMetrixDocsFixture(context);
            dashboardRoute = fixture.dashboardRoute;
        },
        waitFor: [
            { type: 'selector', selector: '.metrix-dashboard--ready', state: 'visible', timeout: 60000 },
            // Must target the isolated card — a bare `.pane` wait matches the first
            // (often visibility:hidden) sibling after createIsolateMetrixWidgetPaneStep.
            {
                type: 'selector',
                selector: `#metrix-docs-widget-${slug}`,
                state: 'visible',
                timeout: 60000,
            },
        ],
        preSteps: [
            createMetrixCleanupStep(),
            // Charts / realtime fetch after mount.
            { type: 'wait', waitFor: { type: 'timeout', ms: 1800 } },
            {
                type: 'wait',
                waitFor: {
                    type: 'selector',
                    selector: '.metrix-dashboard .pane',
                    state: 'attached',
                    timeout: 60000,
                },
            },
            createIsolateMetrixWidgetPaneStep(slug),
        ],
        steps: [],
        target: {
            type: 'selector',
            selector: `#metrix-docs-widget-${slug}`,
            padding: 0,
        },
        caption,
        intent,
    });
}
