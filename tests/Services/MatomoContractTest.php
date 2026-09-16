<?php

declare(strict_types=1);

use Tests\Support\ProviderHttp;
use verbb\metrix\base\WidgetData;
use verbb\metrix\periods\Last7Days;
use verbb\metrix\periods\AllTime;
use verbb\metrix\periods\Last12Months;
use verbb\metrix\sources\Matomo;
use verbb\metrix\widgets\Counter;
use verbb\metrix\widgets\Line;
use verbb\metrix\widgets\Table;

it('requests Matomo aggregate counters for the whole range', function(string $metric, string $method) {
    $source = new Matomo(['apiUrl' => 'https://analytics.example.test', 'apiToken' => 'fixture', 'siteId' => '1']);
    $history = [];
    ProviderHttp::mock($source, [[$metric => 25.5]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Counter(), 'period' => Last7Days::class, 'metric' => $metric]));
    parse_str((string)$history[0]['request']->getBody(), $query);

    expect($query['period'])->toBe('range')->and($query['method'])->toBe($method)->and($data)->toBe(['total' => 25.5]);
})->with([['bounce_rate', 'VisitsSummary.get'], ['nb_pageviews', 'Actions.get']]);

it('rejects Matomo logical API errors returned with HTTP success', function() {
    $source = new Matomo(['apiUrl' => 'https://analytics.example.test', 'apiToken' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [['result' => 'error', 'message' => 'Invalid authentication token']], $history);

    expect(fn() => $source->fetchData(new WidgetData(['widget' => new Counter(), 'period' => Last7Days::class, 'metric' => 'nb_visits'])))
        ->toThrow(Exception::class);
});

it('converts Matomo percentage strings to numeric counter values', function() {
    $source = new Matomo(['apiUrl' => 'https://analytics.example.test', 'apiToken' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [['bounce_rate' => '25.5%']], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Counter(), 'period' => Last7Days::class, 'metric' => 'bounce_rate']));

    expect($data)->toBe(['total' => 25.5]);
});

it('normalizes Matomo monthly report keys for charts', function() {
    $source = new Matomo(['apiUrl' => 'https://analytics.example.test', 'apiToken' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [['2026-08' => ['nb_visits' => 12]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Line(), 'period' => Last12Months::class, 'metric' => 'nb_visits']));

    expect($data)->toBe(['2026-08-01' => 12]);
});

it('uses the configured Matomo site start for All Time reports', function() {
    $source = new Matomo(['apiUrl' => 'https://analytics.example.test', 'apiToken' => 'fixture', 'siteId' => '1']);
    $history = [];
    ProviderHttp::mock($source, [['idsite' => 1, 'ts_created' => '2020-02-03 00:00:00'], ['nb_visits' => 12]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Counter(), 'period' => AllTime::class, 'metric' => 'nb_visits']));
    parse_str((string)$history[1]['request']->getBody(), $query);

    expect($data)->toBe(['total' => 12])->and($query['date'])->toBe('2020-02-03,' . date('Y-m-d'));
});

it('requests unformatted Matomo dimension metrics', function() {
    $source = new Matomo(['apiUrl' => 'https://analytics.example.test', 'apiToken' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [[['label' => 'AU', 'avg_time_on_site' => 42.5]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Table(), 'period' => Last7Days::class, 'metric' => 'avg_time_on_site', 'dimension' => 'country']));
    parse_str((string)$history[0]['request']->getBody(), $query);

    expect($data)->toBe(['AU' => 42.5])->and($query['format_metrics'] ?? null)->toBe('0');
});

it('lists Matomo sites accessible to a token with view permissions', function() {
    $source = new Matomo(['apiUrl' => 'https://analytics.example.test', 'apiToken' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [[['name' => 'Example', 'idsite' => 1]]], $history);
    $options = $source->fetchSourceSettings('siteId');
    parse_str((string)$history[0]['request']->getBody(), $query);

    expect($query['method'])->toBe('SitesManager.getSitesWithAtLeastViewAccess')->and($options)->toBe([['label' => 'Example', 'value' => 1]]);
});
