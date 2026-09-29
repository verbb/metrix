<?php

declare(strict_types=1);

use Tests\Support\ProviderHttp;
use verbb\metrix\base\WidgetData;
use verbb\metrix\models\AnalyticsScope;
use verbb\metrix\periods\AllTime;
use verbb\metrix\periods\Today;
use verbb\metrix\sources\Plausible;
use verbb\metrix\widgets\Counter;
use verbb\metrix\widgets\Line;
use verbb\metrix\widgets\Table;

it('requests aggregate Plausible counters without summing unique visitors across buckets', function() {
    $source = new Plausible(['siteId' => 'audit.invalid', 'apiKey' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [['results' => [['metrics' => [25.5], 'dimensions' => []]]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Counter(), 'period' => Today::class, 'metric' => 'bounce_rate']));
    $payload = json_decode((string)$history[0]['request']->getBody(), true);

    expect($payload['dimensions'] ?? [])->toBe([])->and(array_values($data))->toBe([25.5]);
});

it('queries the supported page dimension including existing saved page widgets', function(string $dimension) {
    $source = new Plausible();
    $history = [];
    ProviderHttp::mock($source, [['results' => [
        ['metrics' => [4], 'dimensions' => ['0']],
        ['metrics' => [2], 'dimensions' => ['']],
    ]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Table(), 'period' => Today::class, 'metric' => 'pageviews', 'dimension' => $dimension]));
    $payload = json_decode((string)$history[0]['request']->getBody(), true);

    expect($payload['dimensions'])->toBe(['event:page'])->and($data)->toBe([0 => 4, '' => 2]);
})->with(['event:page', 'visit:page']);

it('queries all available Plausible history for All Time', function() {
    $source = new Plausible();
    $history = [];
    ProviderHttp::mock($source, [['results' => [['metrics' => [4], 'dimensions' => ['2026-01-01']]]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Line(), 'period' => AllTime::class, 'metric' => 'visitors']));
    $payload = json_decode((string)$history[0]['request']->getBody(), true);

    expect($payload['date_range'])->toBe('all')->and($data)->toBe(['2026-01-01' => 4]);
});

it('keeps realtime Plausible counts within the selected view scope', function() {
    $source = new Plausible();
    $history = [];
    ProviderHttp::mock($source, [['results' => [['metrics' => [5], 'dimensions' => []]]]], $history);
    $data = $source->fetchRealtimeData(new WidgetData(['scope' => new AnalyticsScope(['mode' => 'path', 'pathPrefix' => '/news', 'match' => 'exact'])]));
    $payload = json_decode((string)$history[0]['request']->getBody(), true);

    expect($payload['filters'] ?? [])->toBe([['is', 'event:page', ['/news']]])->and(array_values($data))->toBe([5]);
});
