<?php

declare(strict_types=1);

use verbb\metrix\base\WidgetData;
use verbb\metrix\periods\AllTime;

it('includes the earliest All Time month even when provider rows are unordered', function() {
    $buckets = AllTime::generatePlotDimensions(new WidgetData(), ['2026-08-01' => 10, '2026-01-01' => 20]);

    expect($buckets[0])->toBe('2026-01-01')->and($buckets)->toContain('2026-08-01');
});

it('does not invent historical months when All Time has no data', function() {
    expect(AllTime::generatePlotDimensions(new WidgetData(), []))->toBe([]);
});
