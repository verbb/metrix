<?php

declare(strict_types=1);

use craft\events\RebuildConfigEvent;
use craft\services\ProjectConfig;
use verbb\metrix\Metrix;

it('rebuilds presets under the project config key used by deployment listeners', function() {
    $presets = Metrix::$plugin->getPresets();
    $expected = [];
    foreach ($presets->getAllPresets() as $preset) {
        $expected[$preset->uid] = $presets->createPresetConfig($preset);
    }
    expect($expected)->not->toBeEmpty();
    $event = new RebuildConfigEvent(['config' => []]);
    Craft::$app->getProjectConfig()->trigger(ProjectConfig::EVENT_REBUILD, $event);
    expect($event->config['metrix'])->toBe(['presets' => $expected]);
});
