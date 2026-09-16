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
