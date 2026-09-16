<?php

declare(strict_types=1);

use verbb\metrix\Metrix;
use verbb\metrix\helpers\Options;
use verbb\metrix\widgets\Counter;
use verbb\metrix\services\Sources;
use verbb\metrix\sources\Plausible;

it('initializes new widgets with an enabled type when the configured default is disabled', function() {
    $settings = Metrix::$plugin->getSettings();
    $original = $settings->enabledWidgetTypes;
    $settings->enabledWidgetTypes = [Counter::class];
    try {
        $widget = $settings->getNewWidgetConfig();
        expect($widget['type'])->toBe(Counter::class)
            ->and(array_column(Options::getEnabledWidgetTypeSchemaOptions(), 'type'))->toContain($widget['type'])
            ->and($widget['width'])->toBe((string)$settings->defaultWidgetConfig['width']);
    } finally {
        $settings->enabledWidgetTypes = $original;
    }
});

it('respects the configured default source and otherwise uses the first configured source', function(?string $handle, string $expected) {
    $plugin = Metrix::$plugin;
    $settings = $plugin->getSettings();
    $originalConfig = $settings->defaultWidgetConfig;
    $originalSources = $plugin->getSources();
    $plugin->set('sources', $sources = new Sources());
    $transaction = Craft::$app->getDb()->beginTransaction();
    $projectConfig = Craft::$app->getProjectConfig();
    $configVersion = Craft::$app->getInfo()->configVersion;

    try {
        Craft::$app->getDb()->createCommand()->delete('{{%metrix_sources}}')->execute();
        foreach (['firstDefault', 'requestedDefault'] as $sourceHandle) {
            expect($sources->saveSource(new Plausible(['enabled' => true, 'name' => $sourceHandle, 'handle' => $sourceHandle, 'apiKey' => 'fixture', 'siteId' => 'example.test'])))->toBeTrue();
        }
        $settings->defaultWidgetConfig = ['type' => Counter::class, 'metric' => 'pageviews', 'width' => 2];
        if ($handle !== null) {
            $settings->defaultWidgetConfig['source'] = $handle;
        }

        $widget = $settings->getNewWidgetConfig();
        expect($widget['source'])->toBe($expected)
            ->and($widget['metric'])->toBe('pageviews')
            ->and($widget['width'])->toBe('2');
    } finally {
        $projectConfig->saveModifiedConfigData();
        $transaction->rollBack();
        $projectConfig->reset();
        Craft::$app->getInfo()->configVersion = $configVersion;
        $settings->defaultWidgetConfig = $originalConfig;
        $plugin->set('sources', $originalSources);
    }
})->with([
    'explicit source' => ['requestedDefault', 'requestedDefault'],
    'no source' => [null, 'firstDefault'],
    'missing source' => ['missingDefault', 'firstDefault'],
]);
