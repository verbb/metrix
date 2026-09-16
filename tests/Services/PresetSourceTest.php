<?php

declare(strict_types=1);

use verbb\metrix\Metrix;
use verbb\metrix\models\Preset;
use verbb\metrix\services\Presets;
use verbb\metrix\services\Sources;
use verbb\metrix\sources\Plausible;
use verbb\metrix\widgets\Counter;

it('loads presets after their source is renamed or deleted', function(string $change) {
    $transaction = Craft::$app->getDb()->beginTransaction();
    $projectConfig = Craft::$app->getProjectConfig();
    $configVersion = Craft::$app->getInfo()->configVersion;
    $originalSources = Metrix::$plugin->getSources();
    Metrix::$plugin->set('sources', $sources = new Sources());

    try {
        $source = new Plausible(['name' => 'Preset source', 'handle' => 'presetSource', 'apiKey' => 'fixture', 'siteId' => 'example.test']);
        expect($sources->saveSource($source))->toBeTrue();
        $presets = new Presets();
        $preset = new Preset(['name' => 'Source dependent', 'handle' => 'sourceDependent', 'widgets' => [
            ['type' => Counter::class, 'source' => $source->handle, 'metric' => 'visitors', 'title' => 'Retained title'],
        ]]);
        expect($presets->savePreset($preset))->toBeTrue();

        if ($change === 'rename') {
            $source->handle = 'renamedSource';
            expect($sources->saveSource($source))->toBeTrue();
        } else {
            expect($sources->deleteSource($source))->toBeTrue();
        }

        $loaded = (new Presets())->getPresetById($preset->id);
        expect($loaded->getWidgets())->toHaveCount(1)
            ->and($loaded->getWidgets()[0]->title)->toBe('Retained title')
            ->and($loaded->getWidgets()[0]->getSource())->toBeNull();
    } finally {
        $projectConfig->saveModifiedConfigData();
        $transaction->rollBack();
        $projectConfig->reset();
        Craft::$app->getInfo()->configVersion = $configVersion;
        Metrix::$plugin->set('sources', $originalSources);
    }
})->with(['rename', 'delete']);
