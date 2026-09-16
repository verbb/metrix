<?php

declare(strict_types=1);

use Tests\Support\ProviderHttp;
use verbb\metrix\base\WidgetData;
use verbb\metrix\periods\Last7Days;
use verbb\metrix\sources\MixPanel;
use verbb\metrix\widgets\Line;

it('loads Mixpanel event names from the documented string list', function() {
    $source = new MixPanel(['projectId' => bin2hex(random_bytes(8))]);
    $history = [];
    ProviderHttp::mock($source, [['Signed up', 'Purchase']], $history);

    expect($source->fetchAvailableMetrics())->toBe([
        ['label' => 'Signed up', 'value' => 'Signed up'],
        ['label' => 'Purchase', 'value' => 'Purchase'],
    ]);
});

it('reads Mixpanel series counts by date rather than array position', function() {
    $source = new MixPanel();
    $history = [];
    ProviderHttp::mock($source, [['data' => [
        'series' => ['2026-09-14', '2026-09-15', '2026-09-16'],
        'values' => ['Purchase' => ['2026-09-14' => 12, '2026-09-16' => 7]],
    ]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Line(), 'period' => Last7Days::class, 'metric' => 'Purchase']));

    expect($data)->toBe(['2026-09-14' => 12, '2026-09-15' => 0, '2026-09-16' => 7]);
});

it('tests Mixpanel service account access to the selected project', function() {
    $source = new MixPanel(['projectId' => '12345']);
    $history = [];
    ProviderHttp::mock($source, [[]], $history);

    expect($source->fetchConnection())->toBeTrue();
    $request = $history[0]['request'];
    parse_str($request->getUri()->getQuery(), $query);
    expect($request->getUri()->getPath())->toBe('/api/query/events/names')
        ->and($query)->toMatchArray(['project_id' => '12345', 'type' => 'general']);
});
