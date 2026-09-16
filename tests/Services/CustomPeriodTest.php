<?php

declare(strict_types=1);

use craft\events\RegisterComponentTypesEvent;
use verbb\metrix\Metrix;
use verbb\metrix\models\Settings;
use verbb\metrix\periods\LastWeek;
use verbb\metrix\services\Periods;

it('offers registered custom periods in the default settings and grouped picker', function() {
    $custom = new class extends LastWeek {};
    $service = new Periods();
    $service->on(Periods::EVENT_REGISTER_PERIOD_TYPES, function(RegisterComponentTypesEvent $event) use ($custom) {
        $event->types[] = $custom::class;
    });
    $original = Metrix::$plugin->getPeriods();
    Metrix::$plugin->set('periods', $service);
    try {
        expect(array_merge(...$service->getGroupedPeriodTypes()))->toContain($custom::class);
        expect(array_column((new Settings())->getPeriodSettingsRows(), 'id'))->toContain($custom::class);
    } finally {
        Metrix::$plugin->set('periods', $original);
    }
});
