import type { ScreenshotSetupContext } from '@verbb/docs-screenshots/types';
import { registerPluginBootstrap } from '@verbb/docs-screenshots/api';

export default registerPluginBootstrap({
    id: 'metrix',
    async setup(_context: ScreenshotSetupContext) {
        // Plugin-wide screenshot setup hooks (license, source/OAuth config, etc.).
        // Per-scenario data is seeded from `.screenshots/metrix/fixtures.ts`.
    },
});
