<?php

declare(strict_types=1);

use Tests\Support\ProviderHttp;
use verbb\metrix\base\WidgetData;
use verbb\metrix\periods\AllTime;
use verbb\metrix\periods\Last7Days;
use verbb\metrix\sources\Fathom;
use verbb\metrix\widgets\Counter;
use verbb\metrix\widgets\Table;

it('uses Fathom date filters and reads ungrouped totals', function() {
    $source = new Fathom(['siteId' => 'fixture']);
    $history = [];
    ProviderHttp::mock($source, [[['visits' => '45']]], $history);
    $range = ['start' => new DateTime('2026-09-10 00:00:00'), 'end' => new DateTime('2026-09-16 12:34:56')];
    $data = Last7Days::withDateRange($range, fn() => $source->fetchData(new WidgetData(['widget' => new Counter(), 'period' => Last7Days::class, 'metric' => 'visitors'])));
    parse_str($history[0]['request']->getUri()->getQuery(), $query);

    expect($query)->toMatchArray([
        'aggregates' => 'visits',
        'date_from' => $range['start']->format('Y-m-d H:i:s'),
        'date_to' => $range['end']->format('Y-m-d H:i:s'),
    ])->and(array_values($data))->toBe(['45']);
});

it('omits Fathom date filters for all recorded history', function() {
    $source = new Fathom();
    $history = [];
    ProviderHttp::mock($source, [[['pageviews' => '120']]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Counter(), 'period' => AllTime::class, 'metric' => 'pageviews']));
    parse_str($history[0]['request']->getUri()->getQuery(), $query);

    expect($query)->not->toHaveKeys(['date_from', 'date_to'])->and(array_values($data))->toBe(['120']);
});

it('keeps direct and zero-valued Fathom dimension labels', function() {
    $source = new Fathom();
    $history = [];
    ProviderHttp::mock($source, [[['referrer_hostname' => '', 'pageviews' => '12'], ['referrer_hostname' => '0', 'pageviews' => '4']]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Table(), 'period' => Last7Days::class, 'metric' => 'pageviews', 'dimension' => 'referrer']));

    expect($data)->toBe(['' => '12', 0 => '4']);
});

it('lists Fathom sites beyond the first page', function() {
    $source = new Fathom();
    $history = [];
    ProviderHttp::mock($source, [
        ['data' => [['id' => 'FIRST', 'name' => 'Zebra']], 'has_more' => true],
        ['data' => [['id' => 'SECOND', 'name' => 'Alpha']], 'has_more' => false],
    ], $history);
    $options = $source->fetchSourceSettings('siteId');

    expect($options)->toBe([['label' => 'Alpha', 'value' => 'SECOND'], ['label' => 'Zebra', 'value' => 'FIRST']]);
    parse_str($history[1]['request']->getUri()->getQuery(), $query);
    expect($query['starting_after'])->toBe('FIRST');
});

it('checks Fathom connections without requiring full account access', function() {
    $source = new Fathom(['apiKey' => 'read-only-fixture']);
    $history = [];
    ProviderHttp::mock($source, [['id' => 'token-id', 'scopes' => ['all-sites-readonly']]], $history);
    expect($source->fetchConnection())->toBeTrue()
        ->and($history[0]['request']->getUri()->getPath())->toBe('/v1/token');
});
