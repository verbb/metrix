<?php

declare(strict_types=1);

use verbb\metrix\Metrix;
use verbb\metrix\helpers\Options;
use verbb\metrix\widgets\Counter;

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
