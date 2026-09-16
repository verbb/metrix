<?php

declare(strict_types=1);

use Tests\Support\ProviderHttp;
use verbb\metrix\base\WidgetData;
use verbb\metrix\periods\AllTime;
use verbb\metrix\periods\Last7Days;
use verbb\metrix\periods\Today;
use verbb\metrix\sources\SimpleAnalytics;
use verbb\metrix\widgets\Line;
use verbb\metrix\widgets\Counter;
use verbb\metrix\widgets\Table;

it('retains each hour from Simple Analytics histogram rows', function() {
    $source = new SimpleAnalytics(['hostname' => 'fixture.invalid']);
    $history = [];
    ProviderHttp::mock($source, [['ok' => true, 'histogram' => [
        ['date' => '2026-09-14', 'hour' => 0, 'pageviews' => 4, 'visitors' => 4],
        ['date' => '2026-09-14', 'hour' => 1, 'pageviews' => 16, 'visitors' => 9],
    ]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Line(), 'period' => Today::class, 'metric' => 'visitors']));

    expect($data)->toBe(['2026-09-14 00:00:00' => 4, '2026-09-14 01:00:00' => 9]);
});

it('preserves Simple Analytics dimension labels and the requested row limit', function() {
    $source = new SimpleAnalytics(['hostname' => 'fixture.invalid']);
    $history = [];
    ProviderHttp::mock($source, [['ok' => true, 'referrers' => [
        ['value' => '', 'visitors' => 20, 'pageviews' => 40],
        ['value' => '0', 'visitors' => 10, 'pageviews' => 30],
    ]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Table(), 'period' => Last7Days::class, 'metric' => 'visitors', 'dimension' => 'referrers', 'limit' => 500]));
    parse_str($history[0]['request']->getUri()->getQuery(), $query);

    expect($data)->toBe(['' => 20, 0 => 10])->and((int)$query['limit'])->toBe(500);
});

it('surfaces a Simple Analytics API failure instead of reporting zero traffic', function() {
    $source = new SimpleAnalytics(['hostname' => 'fixture.invalid']);
    $history = [];
    ProviderHttp::mock($source, [['ok' => false, 'error' => 'This website is private.']], $history);

    expect(fn() => $source->fetchData(new WidgetData(['widget' => new Line(), 'period' => Today::class, 'metric' => 'visitors'])))
        ->toThrow(Exception::class);
});

it('requests all available Simple Analytics history for All Time', function() {
    $source = new SimpleAnalytics(['hostname' => 'fixture.invalid']);
    $history = [];
    ProviderHttp::mock($source, [['ok' => true, 'pageviews' => 100]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Counter(), 'period' => AllTime::class, 'metric' => 'pageviews']));
    parse_str($history[0]['request']->getUri()->getQuery(), $query);

    expect($data)->toBe(['total' => 100])->and($query['start'])->toBe('1970-01-01');
});

it('does not substitute page views when a Simple Analytics visitor count is absent', function() {
    $source = new SimpleAnalytics(['hostname' => 'fixture.invalid']);
    $history = [];
    ProviderHttp::mock($source, [['ok' => true, 'referrers' => [['value' => 'example.test', 'pageviews' => 99]]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Table(), 'period' => Last7Days::class, 'metric' => 'visitors', 'dimension' => 'referrers']));

    expect($data)->toBe(['example.test' => 0]);
});
