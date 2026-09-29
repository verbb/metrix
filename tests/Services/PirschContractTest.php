<?php

declare(strict_types=1);

use Tests\Support\ProviderHttp;
use verbb\metrix\base\WidgetData;
use verbb\metrix\periods\AllTime;
use verbb\metrix\periods\Last7Days;
use verbb\metrix\periods\Last12Months;
use verbb\metrix\periods\Today;
use verbb\metrix\sources\Pirsch;
use verbb\metrix\widgets\Counter;
use verbb\metrix\widgets\Line;
use verbb\metrix\widgets\Table;

function pirschFixture(array $responses, array &$history): Pirsch
{
    $source = new Pirsch(['domainId' => 'fixture']);
    $source->cache = ['_settingsKey' => $source->getCacheKey(), 'accessToken' => 'fixture', 'accessTokenExpires' => (new DateTime('+1 hour'))->format(DATE_ATOM)];
    ProviderHttp::mock($source, $responses, $history);

    return $source;
}

it('requests Pirsch hourly reports with the Craft timezone', function() {
    $history = [];
    $source = pirschFixture([[['hour' => 0, 'visitors' => 12], ['hour' => 1, 'visitors' => 7]]], $history);
    $range = ['start' => new DateTime('2026-09-14 00:00:00'), 'end' => new DateTime('2026-09-14 12:00:00')];
    $data = Today::withDateRange($range, fn() => $source->fetchData(new WidgetData(['widget' => new Line(), 'period' => Today::class, 'metric' => 'visitors'])));
    parse_str($history[0]['request']->getUri()->getQuery(), $query);

    expect($data)->toBe(['2026-09-14 00:00:00' => 12, '2026-09-14 01:00:00' => 7])
        ->and($history[0]['request']->getUri()->getPath())->toBe('/api/v1/statistics/hours')
        ->and($query['tz'])->toBe(Craft::$app->getTimeZone());
});

it('normalizes Pirsch monthly buckets and percentage values', function() {
    $history = [];
    $source = pirschFixture([[['month' => '2026-08-01T00:00:00Z', 'bounce_rate' => 0.255]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Line(), 'period' => Last12Months::class, 'metric' => 'bounce_rate']));

    expect($data)->toBe(['2026-08-01' => 25.5]);
});

it('requests Pirsch session durations for duration charts', function() {
    $history = [];
    $source = pirschFixture([[['day' => '2026-09-14T00:00:00Z', 'average_time_spent_seconds' => 42.5]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Line(), 'period' => Last7Days::class, 'metric' => 'avg_duration']));

    expect($data)->toBe(['2026-09-14' => 42.5])
        ->and($history[0]['request']->getUri()->getPath())->toBe('/api/v1/statistics/duration/session');
});

it('uses Pirsch page rate and duration fields rather than visitor counts', function(string $metric, float $expected) {
    $history = [];
    $source = pirschFixture([[['path' => '0', 'visitors' => 99, 'bounce_rate' => 0.255, 'average_time_spent_seconds' => 42.5]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Table(), 'period' => Last7Days::class, 'metric' => $metric, 'dimension' => 'page', 'limit' => 5]));
    parse_str($history[0]['request']->getUri()->getQuery(), $query);

    expect($data)->toBe([0 => $expected])->and((int)$query['limit'])->toBe(5)->and($query['include_title'])->toBe('0');
    if ($metric === 'avg_duration') {
        expect($query['include_avg_time_on_page'])->toBe('1');
    }
})->with([['bounce_rate', 25.5], ['avg_duration', 42.5]]);

it('paginates Pirsch dimension reports to the requested limit', function() {
    $history = [];
    $firstPage = array_map(fn($index) => ['browser' => 'browser-' . $index, 'visitors' => 200 - $index], range(0, 99));
    $source = pirschFixture([$firstPage, [['browser' => 'last', 'visitors' => 1]]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Table(), 'period' => Last7Days::class, 'metric' => 'visitors', 'dimension' => 'browser', 'limit' => 101]));

    expect($data)->toHaveCount(101)->and(count($history))->toBe(2);
    parse_str($history[1]['request']->getUri()->getQuery(), $query);
    expect((int)$query['offset'])->toBe(100)->and((int)$query['limit'])->toBe(1);
});

it('requests a complete Pirsch date range for All Time', function() {
    $history = [];
    $source = pirschFixture([['visitors' => 42]], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Counter(), 'period' => AllTime::class, 'metric' => 'visitors']));
    parse_str($history[0]['request']->getUri()->getQuery(), $query);

    expect($data)->toBe(['total' => 42])->and($query['from'])->toBe('1970-01-01')->and($query['to'])->toBe(date('Y-m-d'));
});

it('refreshes a rejected Pirsch access token and retries once', function() {
    $history = [];
    $source = pirschFixture([
        new \GuzzleHttp\Psr7\Response(401, [], '{"error":"expired"}'),
        ['access_token' => 'replacement', 'expires_at' => (new DateTime('+1 hour'))->format(DATE_ATOM)],
        ['visitors' => 42],
    ], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new Counter(), 'period' => Last7Days::class, 'metric' => 'visitors']));

    expect($data)->toBe(['total' => 42])->and(count($history))->toBe(3)
        ->and($history[1]['request']->getUri()->getPath())->toBe('/api/v1/token')
        ->and($history[2]['request']->getHeaderLine('Authorization'))->toBe('Bearer replacement')
        ->and($source->cache['accessToken'])->toBe('replacement');
});

it('returns empty Pirsch domain options when the API returns null', function() {
    $history = [];
    $source = pirschFixture([null], $history);

    expect($source->fetchSourceSettings('domainId'))->toBe([]);
});
