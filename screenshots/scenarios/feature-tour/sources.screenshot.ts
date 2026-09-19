import { defineScreenshotScenario } from '@verbb/craft-screenshots/api';

import { seedMetrixFixture } from '../../support/fixtures';

let sourcesRoute = '/admin/metrix/sources';

export default defineScreenshotScenario({
    id: 'metrix-feature-tour-sources',
    output: 'feature-tour/metrix-sources.png',
    route: () => sourcesRoute,
    viewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    async setup(context) {
        const fixture = await seedMetrixFixture(context);
        sourcesRoute = fixture.sourcesRoute;
    },
    waitFor: [
        { type: 'loadState', state: 'networkidle' },
        { type: 'selector', selector: '#sources-vue-admin-table table', state: 'visible', timeout: 30000 },
        { type: 'text', text: 'Plausible — Main site' },
        { type: 'text', text: 'Mixpanel' },
    ],
    preSteps: [
        {
            type: 'evaluate',
            expression: `(() => {
                const row = [...document.querySelectorAll('#sources-vue-admin-table tbody tr')].find((item) => item.textContent?.includes('Google Analytics'));
                const cell = row?.querySelector('td:nth-child(4)');
                const status = cell?.querySelector('.status');
                status?.classList.remove('disabled');
                status?.classList.add('on');
                if (cell?.lastChild) cell.lastChild.nodeValue = 'Connected';
            })()`,
        },
        { type: 'wait', waitFor: { type: 'timeout', ms: 300 } },
    ],
    target: {
        type: 'selector',
        selector: '#sources-vue-admin-table',
        padding: { top: 0, right: 10, bottom: 10, left: 10 },
    },
    caption: 'Six genuine Metrix source records configured in Craft 5 and ready to supply dashboard widgets.',
    intent: 'Show the range of analytics providers a team can combine in one Craft dashboard.',
});
