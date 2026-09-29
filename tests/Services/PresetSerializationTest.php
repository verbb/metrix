<?php

declare(strict_types=1);

use verbb\metrix\models\Preset;
use verbb\metrix\periods\Today;
use verbb\metrix\widgets\Counter;

it('round trips editable preset widget data returned to the control panel', function() {
    $widget = new Counter(['title' => 'Audit count', 'metric' => 'pageviews', 'period' => Today::class]);
    $preset = new Preset();
    $preset->setWidgets([$widget->getFrontEndData()]);

    expect($preset->getWidgets())->toHaveCount(1)
        ->and($preset->getWidgets()[0]->title)->toBe('Audit count');
});
