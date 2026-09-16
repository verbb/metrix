<?php

declare(strict_types=1);

use Tests\Support\ProviderHttp;
use verbb\metrix\base\WidgetData;
use verbb\metrix\periods\Last7Days;
use verbb\metrix\periods\Last12Months;
use verbb\metrix\periods\Today;
use verbb\metrix\sources\Cloudflare;
use verbb\metrix\widgets\Counter;
use verbb\metrix\widgets\Line;
use verbb\metrix\widgets\Table;

it('uses Cloudflare hourly dimensions and time filters', function() {
    $source = new Cloudflare(['apiToken' => 'fixture', 'zoneId' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [['data' => ['viewer' => ['zones' => [['httpRequests1hGroups' => [
        ['dimensions' => ['datetime' => '2026-09-14T01:00:00Z'], 'sum' => ['requests' => 12]],
    ]]]]]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Line(), 'period' => Today::class, 'metric' => 'requests']));
    $body = json_decode((string)$history[0]['request']->getBody(), true);

    expect($data)->toBe(['2026-09-14 01:00:00' => 12])->and($body['query'])->toContain('datetime_geq', 'datetime_leq');
});

it('aggregates Cloudflare daily bytes into monthly bandwidth buckets', function() {
    $source = new Cloudflare(['apiToken' => 'fixture', 'zoneId' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [['data' => ['viewer' => ['zones' => [['httpRequests1dGroups' => [
        ['dimensions' => ['date' => '2026-08-01'], 'sum' => ['bytes' => 12]],
        ['dimensions' => ['date' => '2026-08-02'], 'sum' => ['bytes' => 18]],
    ]]]]]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Line(), 'period' => Last12Months::class, 'metric' => 'bandwidth']));
    $body = json_decode((string)$history[0]['request']->getBody(), true);

    expect($data)->toBe(['2026-08-01' => 30])->and($body['query'])->toContain('httpRequests1dGroups', 'bytes')->not->toContain('bandwidth');
});

it('reads Cloudflare nested dimension maps across all returned groups', function(string $dimension, string $metric, string $map, string $labelField) {
    $source = new Cloudflare(['apiToken' => 'fixture', 'zoneId' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [['data' => ['viewer' => ['zones' => [['httpRequests1dGroups' => [
        ['sum' => [$map => [[$labelField => 'AU', $metric => 12]]]],
        ['sum' => [$map => [[$labelField => 'AU', $metric => 18]]]],
    ]]]]]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Table(), 'period' => Last7Days::class, 'metric' => $metric, 'dimension' => $dimension]));

    expect($data)->toBe(['AU' => 30]);
})->with([['country', 'requests', 'countryMap', 'clientCountryName'], ['browser', 'pageViews', 'browserMap', 'uaBrowserFamily']]);

it('reports Cloudflare GraphQL errors instead of empty traffic', function() {
    $source = new Cloudflare(['apiToken' => 'fixture', 'zoneId' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [['data' => null, 'errors' => [['message' => 'query exceeds allowed time range']]]], $history);

    expect(fn() => $source->fetchData(new WidgetData(['widget' => new Counter(), 'period' => Last7Days::class, 'metric' => 'requests'])))
        ->toThrow(Exception::class);
});

it('paginates Cloudflare zone options within the API page size', function() {
    $source = new Cloudflare(['apiToken' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [
        ['success' => true, 'result' => [['name' => 'B', 'id' => 'b']], 'result_info' => ['total_pages' => 2]],
        ['success' => true, 'result' => [['name' => 'A', 'id' => 'a']], 'result_info' => ['total_pages' => 2]],
    ], $history);
    $options = $source->fetchSourceSettings('zoneId');
    parse_str($history[0]['request']->getUri()->getQuery(), $query);

    expect($options)->toBe([['label' => 'A', 'value' => 'a'], ['label' => 'B', 'value' => 'b']])->and((int)$query['per_page'])->toBe(50);
});

it('queries available Cloudflare history in bounded non-overlapping daily ranges', function() {
    $source = new Cloudflare(['apiToken' => 'fixture', 'zoneId' => 'fixture']);
    $history = [];
    $zone = static fn(array $data) => ['data' => ['viewer' => ['zones' => [$data]]]];
    ProviderHttp::mock($source, [
        $zone(['settings' => ['httpRequests1dGroups' => ['enabled' => true, 'notOlderThan' => 259200, 'maxDuration' => 86400, 'maxPageSize' => 2]]]),
        $zone(['httpRequests1dGroups' => [['sum' => ['requests' => 10]]]]),
        $zone(['httpRequests1dGroups' => [['sum' => ['requests' => 20]]]]),
        $zone(['httpRequests1dGroups' => [['sum' => ['requests' => 30]]]]),
    ], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Counter(), 'period' => \verbb\metrix\periods\AllTime::class, 'metric' => 'requests']));

    expect($data)->toBe(['total' => 60])->and($history)->toHaveCount(4);
    $dates = [];
    foreach (array_slice($history, 1) as $entry) {
        $query = json_decode((string)$entry['request']->getBody(), true)['query'];
        preg_match('/date_geq: "([0-9-]+)", date_leq: "([0-9-]+)"/', $query, $matches);
        expect($matches[1])->toBe($matches[2])->and($query)->toContain('limit: 2');
        $dates[] = $matches[1];
    }
    expect((new DateTimeImmutable($dates[0]))->modify('+1 day')->format('Y-m-d'))->toBe($dates[1])
        ->and((new DateTimeImmutable($dates[1]))->modify('+1 day')->format('Y-m-d'))->toBe($dates[2]);
});
