import type { ScreenshotSetupContext } from '@verbb/docs-screenshots/types';
import { registerPluginBootstrap } from '@verbb/docs-screenshots/api';

import { ensureMetrixDocsModule } from './metrix/fixtures';

export default registerPluginBootstrap({
    id: 'metrix',
    async setup(context: ScreenshotSetupContext) {
        await context.runCraft(['migrate/up', '--plugin=metrix'], { allowFailure: true });
        // Demo source must exist before seed + CP widget-data requests.
        await ensureMetrixDocsModule(context.installDir);
    },
});
