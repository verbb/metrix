import type { ScreenshotSetupContext } from '@verbb/docs-screenshots/types';

export type MetrixDocsFixture = {
    dashboardRoute: string;
};

/**
 * Metrix docs fixture. The dashboard route renders without seeding (empty-state on a
 * fresh install), so this starter just resolves the route. As the Phase 1 dashboard lands,
 * seed sources/views/widgets here via `context.runCraftScript(...)` (see hyper/fixtures.ts)
 * so the screenshot shows a populated dashboard.
 */
export async function seedMetrixDocsFixture(context: ScreenshotSetupContext): Promise<MetrixDocsFixture> {
    const adminPath = context.profile.adminPath || 'admin';

    return {
        dashboardRoute: `/${adminPath}/metrix`,
    };
}
