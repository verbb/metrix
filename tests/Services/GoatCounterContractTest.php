<?php

declare(strict_types=1);

use Tests\Support\ProviderHttp;
use verbb\metrix\base\WidgetData;
use verbb\metrix\periods\Last7Days;
use verbb\metrix\periods\Last12Months;
use verbb\metrix\periods\Today;
use verbb\metrix\sources\GoatCounter;
use verbb\metrix\widgets\Line;
use verbb\metrix\widgets\Table;

it('uses GoatCounter hourly values for hourly charts', function() {
    $source = new GoatCounter(['siteUrl' => 'https://fixture.invalid', 'apiKey' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [['stats' => [['day' => '2026-09-14', 'daily' => 13, 'hourly' => [4, 9]]]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Line(), 'period' => Today::class, 'metric' => 'visitors']));

    expect($data)->toBe(['2026-09-14 00:00:00' => 4, '2026-09-14 01:00:00' => 9]);
});

it('uses GoatCounter monthly totals once per month', function() {
    $source = new GoatCounter(['siteUrl' => 'https://fixture.invalid', 'apiKey' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [['stats' => [
        ['day' => '2026-08-01', 'daily' => 4, 'monthly' => 13],
        ['day' => '2026-08-02', 'daily' => 9],
        ['day' => '2026-09-01', 'daily' => 1, 'monthly' => 1],
    ]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Line(), 'period' => Last12Months::class, 'metric' => 'visitors']));

    expect($data)->toBe(['2026-08-01' => 13, '2026-09-01' => 1]);
});

it('retains empty and zero GoatCounter dimension labels', function() {
    $source = new GoatCounter(['siteUrl' => 'https://fixture.invalid', 'apiKey' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [['stats' => [['name' => '', 'count' => 20], ['name' => '0', 'count' => 10]]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Table(), 'period' => Last7Days::class, 'metric' => 'visitors', 'dimension' => 'toprefs', 'limit' => 5]));
    parse_str($history[0]['request']->getUri()->getQuery(), $query);

    expect($data)->toBe(['' => 20, 0 => 10])->and((int)$query['limit'])->toBe(5);
});

it('sends the GoatCounter JSON content type', function() {
    $source = new GoatCounter(['siteUrl' => 'https://fixture.invalid', 'apiKey' => 'fixture']);

    expect($source->getClient()->getConfig('headers')['Content-Type'] ?? null)->toBe('application/json');
});

it('uses the first recorded GoatCounter hit for All Time', function() {
    $source = new GoatCounter(['siteUrl' => 'https://fixture.invalid', 'apiKey' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [['sites' => [['first_hit_at' => '2020-02-03T10:00:00Z', 'created_at' => '2021-01-01T00:00:00Z']]], ['total' => 42]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new \verbb\metrix\widgets\Counter(), 'period' => \verbb\metrix\periods\AllTime::class, 'metric' => 'visitors']));
    parse_str($history[1]['request']->getUri()->getQuery(), $query);

    expect($data)->toBe(['total' => 42])->and($query['start'])->toBe('2020-02-03T00:00:00Z');
});

it('paginates GoatCounter dimension reports beyond 100 rows', function(string $dimension, string $collection, string $label) {
    $source = new GoatCounter(['siteUrl' => 'https://fixture.invalid', 'apiKey' => 'fixture']);
    $history = [];
    $rows = array_map(fn($i) => [$label => 'row-' . $i, 'path_id' => $i, 'count' => 200 - $i], range(1, 100));
    ProviderHttp::mock($source, [[$collection => $rows, 'more' => true], [$collection => [[$label => 'last', 'path_id' => 101, 'count' => 1]], 'more' => false]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Table(), 'period' => Last7Days::class, 'metric' => 'visitors', 'dimension' => $dimension, 'limit' => 101]));

    expect($data)->toHaveCount(101)->and(count($history))->toBe(2);
    parse_str($history[1]['request']->getUri()->getQuery(), $query);
    expect((int)$query['limit'])->toBe(1);
    expect($dimension === 'pages' ? $query['exclude_paths'] : $query['offset'])->toBe($dimension === 'pages' ? implode(',', range(1, 100)) : '100');
})->with([['pages', 'hits', 'path'], ['toprefs', 'stats', 'name']]);

it('retries a GoatCounter rate limit once and preserves the query', function() {
    $source = new GoatCounter(['siteUrl' => 'https://fixture.invalid', 'apiKey' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [new \GuzzleHttp\Psr7\Response(429, ['X-Rate-Limit-Reset' => '0'], '{"error":"rate limited"}'), ['total' => 42]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new \verbb\metrix\widgets\Counter(), 'period' => Last7Days::class, 'metric' => 'visitors']));

    expect($data)->toBe(['total' => 42])->and(count($history))->toBe(2)
        ->and((string)$history[1]['request']->getUri())->toBe((string)$history[0]['request']->getUri());
});
