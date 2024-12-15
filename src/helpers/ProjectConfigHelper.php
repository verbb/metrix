<?php
namespace verbb\metrix\helpers;

use verbb\metrix\Metrix;

use Craft;
use craft\db\Query;

class ProjectConfigHelper
{
    // Static Methods
    // =========================================================================

    public static function rebuildProjectConfig(): array
    {
        $configData = [];

        $configData['metrix'] = self::_getPresetsData();

        return array_filter($configData);
    }

    
    // Private Methods
    // =========================================================================

    private static function _getPresetsData(): array
    {
        $data = [];

        $presetsService = Metrix::$plugin->getPresets();

        foreach ($presetsService->getAllPresets() as $preset) {
            $data[$preset->uid] = $presetsService->createPresetConfig($preset);
        }

        return $data;
    }
}
