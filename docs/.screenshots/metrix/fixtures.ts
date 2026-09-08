import { readFileSync } from 'node:fs';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ScreenshotSetupContext } from '@verbb/docs-screenshots/types';

export type MetrixDocsFixture = {
    dashboardRoute: string;
    sourcesRoute: string;
    /** Settings → Presets → edit (Widgets tab cutout). */
    presetEditRoute?: string;
    presetId?: number;
    viewId: number;
    viewHandle: string;
    sourceId: number;
    sourceHandle: string;
    firstWidgetId: number | null;
    /** Seed order keys: sessions-line, active-users, sessions-counter, browser-pie, os-table, country-table. */
    widgetIds?: Record<string, number>;
};

const fixtureDir = dirname(fileURLToPath(import.meta.url));
const seedScript = readFileSync(join(fixtureDir, 'seed-docs-dashboard.php'), 'utf8');

/**
 * Inject DocsDemoSource module into the disposable Craft install, then seed a
 * populated Default dashboard (demo source + line/counter/pie/table widgets).
 */
export async function seedMetrixDocsFixture(context: ScreenshotSetupContext): Promise<MetrixDocsFixture> {
    await ensureMetrixDocsModule(context.installDir);

    const output = await context.runCraftScript(seedScript, { label: 'seed-metrix-docs-dashboard' });
    const fixture = JSON.parse(output.trim()) as MetrixDocsFixture;

    if (!fixture.dashboardRoute || !fixture.sourcesRoute || !fixture.sourceId) {
        throw new Error(`Invalid Metrix docs fixture payload: ${output}`);
    }

    return fixture;
}

/** Copy docs-only Demo Analytics module + wire it into config/app.php. */
export async function ensureMetrixDocsModule(installDir: string): Promise<void> {
    const moduleDir = join(installDir, 'modules/metrixdocs');
    await mkdir(moduleDir, { recursive: true });
    await copyFile(join(fixtureDir, 'Module.php'), join(moduleDir, 'Module.php'));
    await copyFile(join(fixtureDir, 'DocsDemoSource.php'), join(moduleDir, 'DocsDemoSource.php'));

    const appPath = join(installDir, 'config/app.php');
    let contents = await readFile(appPath, 'utf8');

    if (contents.includes("'metrixDocs'")) {
        return;
    }

    if (!contents.includes("App::env('CRAFT_APP_ID')")) {
        throw new Error(`Unexpected Craft config/app.php shape; cannot register metrixDocs module.\n${contents}`);
    }

    // Idempotent patch: require module files and bootstrap so widget AJAX can resolve DocsDemoSource.
    contents = contents.replace(
        /return\s*\[\s*'id'\s*=>\s*App::env\('CRAFT_APP_ID'\)\s*\?:\s*'CraftCMS',\s*\];/s,
        `require_once dirname(__DIR__) . '/modules/metrixdocs/Module.php';
require_once dirname(__DIR__) . '/modules/metrixdocs/DocsDemoSource.php';

return [
    'id' => App::env('CRAFT_APP_ID') ?: 'CraftCMS',
    'modules' => [
        'metrixDocs' => \\modules\\metrixdocs\\Module::class,
    ],
    'bootstrap' => ['metrixDocs'],
];`,
    );

    if (!contents.includes("'metrixDocs'")) {
        throw new Error('Failed to patch config/app.php for metrixDocs module.');
    }

    await writeFile(appPath, contents);
}
