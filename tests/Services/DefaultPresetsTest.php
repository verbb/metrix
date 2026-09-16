<?php

declare(strict_types=1);

use verbb\metrix\Metrix;
use verbb\metrix\helpers\SemanticPresets;
use verbb\metrix\models\Preset;

it('accepts every bundled preset through the normal model validation', function() {
    foreach (SemanticPresets::getDefinitions() as $handle => $definition) {
        $preset = new Preset([
            'name' => $definition['name'],
            'handle' => $handle,
            'widgets' => $definition['widgets'],
        ]);
        // Existing installed defaults are valid when editing their own identity.
        $preset->id = Metrix::$plugin->getPresets()->getPresetByHandle($handle)?->id;
        expect($preset->validate())->toBeTrue(json_encode($preset->getErrors()));
    }
});

it('seeds all four presets on a clean installation', function() {
    expect(array_column(Metrix::$plugin->getPresets()->getAllPresets(), 'name'))
        ->toContain('Website Overview', 'Content Performance', 'Acquisition', 'Realtime');
});
