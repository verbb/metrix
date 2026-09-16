<?php

declare(strict_types=1);

use verbb\metrix\Metrix;
use verbb\metrix\models\Preset;
use verbb\metrix\sources\Plausible;
use verbb\metrix\widgets\Counter;
use verbb\metrix\widgets\MissingWidget;

class RestoredPresetWidget extends Counter
{
    public ?string $customKey = null;
}

it('retains unknown custom settings when creating a missing widget placeholder', function() {
    $widget = Metrix::$plugin->getWidgets()->createWidget([
        'type' => 'modules\\unavailable\\Widget', 'customKey' => 'retained', 'title' => 'Missing widget title',
    ]);
    expect($widget)->toBeInstanceOf(MissingWidget::class)
        ->and($widget->settings['customKey'])->toBe('retained')
        ->and($widget->title)->toBe('Missing widget title');
});

it('recovers missing preset widgets after an editor round trip and extension restoration', function() {
    $widget = new MissingWidget([
        'expectedType' => RestoredPresetWidget::class,
        'settings' => ['customKey' => 'retained'],
        'title' => 'Restored widget title',
    ]);
    $widget->setSource(new Plausible(['handle' => 'missingPresetSource']));
    $preset = new Preset(['widgets' => [$widget]]);
    $frontend = $preset->getFrontEndWidgets();
    expect($frontend[0]['expectedType'] ?? null)->toBe(RestoredPresetWidget::class);
    $preset->setWidgets($frontend);
    $restored = $preset->getWidgets()[0];
    expect($restored)->toBeInstanceOf(RestoredPresetWidget::class)
        ->and($restored->customKey)->toBe('retained')
        ->and($restored->title)->toBe('Restored widget title');
});
