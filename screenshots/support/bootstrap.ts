import type { ScreenshotSetupContext } from '@verbb/craft-screenshots/types';
import { registerPluginBootstrap } from '@verbb/craft-screenshots/api';

import { ensureMetrixDocsModule } from './docs/fixtures';

export default registerPluginBootstrap({
    id: 'metrix',
    async setup(context: ScreenshotSetupContext) {
        await context.runCraft(['migrate/up', '--plugin=metrix'], { allowFailure: true });
        // Demo source must exist before seed + CP widget-data requests.
        await ensureMetrixDocsModule(context.installDir);
    },
});
