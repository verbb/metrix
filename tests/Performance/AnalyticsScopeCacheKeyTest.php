<?php

declare(strict_types=1);

use verbb\metrix\models\AnalyticsScope;

it('builds distinct analytics-scope cache identities at dashboard scale', function() {
    $keys = [];
    $start = hrtime(true);

    for ($i = 0; $i < 10_000; $i++) {
        $keys[] = (new AnalyticsScope([
            'mode' => 'path',
            'pathPrefix' => '/section/' . $i,
            'match' => AnalyticsScope::MATCH_BEGINS_WITH,
        ]))->cacheKey();
    }

    $elapsed = (hrtime(true) - $start) / 1_000_000_000;

    expect(array_unique($keys))->toHaveCount(10_000)
        ->and($keys[0])->toBe('scope:path:/section/0:begins_with')
        ->and($keys[9999])->toBe('scope:path:/section/9999:begins_with')
        ->and($elapsed)->toBeLessThan(1.5);
})->group('perf');
