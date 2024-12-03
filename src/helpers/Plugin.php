<?php
namespace verbb\metrix\helpers;

use verbb\metrix\Metrix;
use verbb\metrix\web\assets\charts\MetrixAsset;

class Plugin
{
    // Static Methods
    // =========================================================================

    public static function registerAsset(string $path): void
    {
        $viteService = Metrix::$plugin->getVite();

        $scriptOptions = [
            'depends' => [
                MetrixAsset::class,
            ],
            'onload' => '',
        ];

        $styleOptions = [
            'depends' => [
                MetrixAsset::class,
            ],
        ];

        $viteService->register($path, false, $scriptOptions, $styleOptions);

        // Provide nice build errors - only in dev
        if ($viteService->devServerRunning()) {
            $viteService->register('@vite/client', false);
        }
    }

}
