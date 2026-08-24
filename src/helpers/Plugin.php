<?php
namespace verbb\metrix\helpers;

use verbb\metrix\Metrix;
use verbb\metrix\web\assets\src\CpReactAsset;
use verbb\metrix\web\assets\src\MetrixCpAsset;

use Craft;

class Plugin
{
    // Static Methods
    // =========================================================================

    /** Plain CP styles + Verbb base assets for settings, tables, source chrome, etc. */
    public static function registerCpAssets(): void
    {
        $viteService = Metrix::$plugin->getVite();

        if ($viteService->devServerRunning()) {
            self::registerCpAsset('src/cp/metrix-cp-styles.js', MetrixCpAsset::class);

            return;
        }

        Craft::$app->getView()->registerAssetBundle(MetrixCpAsset::class);
    }

    public static function registerDashboardAssets(): void
    {
        self::registerCpAsset('src/dashboard/metrix-dashboard.js');
    }

    public static function registerPresetsAssets(): void
    {
        self::registerCpAsset('src/presets/metrix-presets.js');
    }

    public static function registerSourcesAssets(): void
    {
        self::registerCpAsset('src/sources/metrix-sources.js');
    }

    /** Source edit dynamic settings refresh. Must load via Vite (ES module + kit chunk). */
    public static function registerSourcesCpJs(): void
    {
        self::registerCpAsset('src/cp/js/metrix-cp.js', MetrixCpAsset::class);
    }

    public static function registerCpAsset(string $path, string|array $devDepends = CpReactAsset::class, ?string $productionBundleClass = null): void
    {
        $viteService = Metrix::$plugin->getVite();

        if (!$viteService->devServerRunning() && $productionBundleClass) {
            Craft::$app->getView()->registerAssetBundle($productionBundleClass);

            return;
        }

        $depends = is_array($devDepends) ? $devDepends : [$devDepends];

        $scriptOptions = [
            'depends' => $depends,
            'onload' => '',
        ];

        $styleOptions = [
            'depends' => $depends,
        ];

        $viteService->register($path, false, $scriptOptions, $styleOptions);

        if ($viteService->devServerRunning()) {
            $viteService->register('@vite/client', false);
        }
    }

    /**
     * @deprecated Use {@see registerDashboardAssets()}, {@see registerPresetsAssets()}, or {@see registerSourcesAssets()}.
     */
    public static function registerAsset(string $path): void
    {
        self::registerCpAsset($path);
    }

}
