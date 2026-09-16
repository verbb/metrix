<?php

declare(strict_types=1);

use verbb\metrix\sources\Fathom;

it('persists a successful empty provider option refresh', function() {
    $source = new class extends Fathom {
        public function fetchSourceSettings(string $settingsKey): ?array
        {
            return [];
        }
    };
    $source->cache = ['_settingsKey' => $source->getCacheKey(), 'siteId' => [['label' => 'Removed site', 'value' => 'removed']]];
    expect($source->getSourceSettings('siteId', false))->toBe([])
        ->and($source->getSourceSettings('siteId'))->toBe([]);
});
