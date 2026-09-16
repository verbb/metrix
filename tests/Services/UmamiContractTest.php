<?php

declare(strict_types=1);

use Tests\Support\ProviderHttp;
use verbb\metrix\base\WidgetData;
use verbb\metrix\periods\AllTime;
use verbb\metrix\periods\Last7Days;
use verbb\metrix\periods\Last12Months;
use verbb\metrix\sources\Umami;
use verbb\metrix\widgets\Counter;
use verbb\metrix\widgets\Line;
use verbb\metrix\widgets\Table;

it('uses the correct Cloud and self-hosted Umami API paths', function(string $baseUrl, string $expectedPath) {
    $source = new Umami(['baseUrl' => $baseUrl, 'apiKey' => 'fixture', 'websiteId' => 'test']);
    $history = [];
    ProviderHttp::mock($source, [['pageviews' => 12]], $history);
    $source->fetchData(new WidgetData(['widget' => new Counter(), 'period' => Last7Days::class, 'metric' => 'pageviews']));

    expect($history[0]['request']->getUri()->getPath())->toBe($expectedPath);
})->with([
    ['https://api.umami.is/', '/v1/websites/test/stats'],
    ['https://api.umami.is/v1/eu', '/v1/eu/websites/test/stats'],
    ['https://analytics.example.com/subdirectory', '/subdirectory/api/websites/test/stats'],
]);

it('calculates Umami dimension rates and durations from the row totals', function(string $metric, float $expected) {
    $source = new Umami(['apiKey' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [[['name' => '', 'visits' => 8, 'bounces' => 2, 'totaltime' => 128]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Table(), 'period' => Last7Days::class, 'dimension' => 'referrer', 'metric' => $metric]));

    expect($data)->toBe(['' => $expected]);
})->with([['bounce_rate', 25.0], ['avg_duration', 16.0]]);

it('normalizes Umami monthly buckets to the period keys', function() {
    $source = new Umami(['apiKey' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [['pageviews' => [['x' => '2026-08-01T00:00:00Z', 'y' => 12]]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Line(), 'period' => Last12Months::class, 'metric' => 'pageviews']));
    parse_str($history[0]['request']->getUri()->getQuery(), $query);

    expect($data)->toBe(['2026-08-01' => 12])->and($query['timezone'])->toBe(Craft::$app->getTimeZone());
});

it('uses the available Umami history for All Time', function() {
    $source = new Umami(['apiKey' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [
        ['startDate' => '2020-02-01T00:00:00Z', 'endDate' => '2026-09-15T15:00:00Z'],
        ['pageviews' => 100],
    ], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Counter(), 'period' => AllTime::class, 'metric' => 'pageviews']));
    parse_str($history[1]['request']->getUri()->getQuery(), $query);

    expect($data)->toBe(['total' => 100.0])->and((int)$query['startAt'])->toBe(1580515200000);
});
