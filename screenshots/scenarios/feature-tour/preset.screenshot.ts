import { defineScreenshotScenario } from '@verbb/craft-screenshots/api';

import { seedMetrixFixture } from '../../support/fixtures';

let presetRoute = '/admin/metrix/settings/presets';

export default defineScreenshotScenario({
    id: 'metrix-feature-tour-preset',
    output: 'feature-tour/metrix-preset.png',
    route: () => presetRoute,
    viewport: { width: 1280, height: 1000, deviceScaleFactor: 2 },
    async setup(context) {
        const fixture = await seedMetrixFixture(context);
        presetRoute = fixture.presetRoute;
    },
    waitFor: [
        { type: 'loadState', state: 'networkidle' },
        { type: 'selector', selector: '.metrix-presets', state: 'visible', timeout: 30000 },
        { type: 'text', text: 'Operating System' },
        { type: 'text', text: 'New widget' },
    ],
    steps: [
        { type: 'wait', waitFor: { type: 'timeout', ms: 300 } },
    ],
    target: {
        type: 'selector',
        selector: '.metrix-presets',
        padding: 12,
    },
    caption: 'A reusable Metrix preset assembled from the same real widget types used on a dashboard.',
    intent: 'Show how a proven dashboard setup can be stored and reused instead of rebuilt widget by widget.',
});
