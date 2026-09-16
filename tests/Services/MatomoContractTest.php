<?php

declare(strict_types=1);

use Tests\Support\ProviderHttp;
use verbb\metrix\base\WidgetData;
use verbb\metrix\periods\Last7Days;
use verbb\metrix\sources\Matomo;
use verbb\metrix\widgets\Counter;

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
