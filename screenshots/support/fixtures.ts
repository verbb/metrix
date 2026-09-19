import { readFileSync } from 'node:fs';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ScreenshotSetupContext } from '@verbb/craft-screenshots/types';

type MetrixFixture = {
    dashboardRoute: string;
    sourcesRoute: string;
    presetRoute: string;
};

const supportDir = dirname(fileURLToPath(import.meta.url));
const seedScript = readFileSync(join(supportDir, 'seed', 'seed-metrix.php'), 'utf8');

/** Seed real Metrix sources, widgets, views and a reusable preset. */
export async function seedMetrixFixture(context: ScreenshotSetupContext): Promise<MetrixFixture> {
    await ensureMetrixScreenshotModule(context.installDir);

    const output = await context.runCraftScript(seedScript, { label: 'seed-metrix-feature-tour' });
    const fixture = JSON.parse(output.trim()) as MetrixFixture;

    if (!fixture.dashboardRoute || !fixture.sourcesRoute || !fixture.presetRoute) {
        throw new Error(`Invalid Metrix fixture payload: ${output}`);
    }

    return fixture;
}

/** Register a deterministic analytics source in the isolated Craft install. */
async function ensureMetrixScreenshotModule(installDir: string): Promise<void> {
    const moduleDir = join(installDir, 'modules/metrixscreenshots');
    await mkdir(moduleDir, { recursive: true });

    for (const filename of ['Module.php', 'ScreenshotPlausibleSource.php']) {
        await copyFile(join(supportDir, 'module', filename), join(moduleDir, filename));
    }

    const appPath = join(installDir, 'config/app.php');
    let contents = await readFile(appPath, 'utf8');

    if (contents.includes("'metrixScreenshots'")) {
        return;
    }

    contents = contents.replace(
        /return\s*\[\s*'id'\s*=>\s*App::env\('CRAFT_APP_ID'\)\s*\?:\s*'CraftCMS',\s*\];/s,
        `require_once dirname(__DIR__) . '/modules/metrixscreenshots/Module.php';
require_once dirname(__DIR__) . '/modules/metrixscreenshots/ScreenshotPlausibleSource.php';

return [
    'id' => App::env('CRAFT_APP_ID') ?: 'CraftCMS',
    'modules' => [
        'metrixScreenshots' => \\modules\\metrixscreenshots\\Module::class,
    ],
    'bootstrap' => ['metrixScreenshots'],
];`,
    );

    if (!contents.includes("'metrixScreenshots'")) {
        throw new Error('Failed to register the Metrix screenshot module.');
    }

    await writeFile(appPath, contents);
}
