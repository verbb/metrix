<?php

declare(strict_types=1);

use Tests\Support\ProviderHttp;
use verbb\metrix\periods\Last7Days;
use verbb\metrix\sources\GoatCounter;
use verbb\metrix\sources\Matomo;
use verbb\metrix\sources\Pirsch;
use verbb\metrix\sources\SimpleAnalytics;
use verbb\metrix\sources\Umami;
use verbb\metrix\widgets\Line;
use verbb\metrix\widgets\data\PlotData;

class CustomChartData extends PlotData {}

class CustomChartWidget extends Line
{
    public static function getDataType(): string
    {
        return CustomChartData::class;
    }
}

it('requests time series for inherited custom plot transformers', function(string $class, array $config, array $response, string $metric) {
    $source = new $class($config);
    $source->cache = ['_settingsKey' => $source->getCacheKey(), 'accessToken' => 'fixture', 'accessTokenExpires' => (new DateTime('+1 hour'))->format(DATE_ATOM)];
    $history = [];
    ProviderHttp::mock($source, [$response], $history);
    $data = $source->fetchData(new CustomChartData(['widget' => new CustomChartWidget(), 'period' => Last7Days::class, 'metric' => $metric]));

    expect($data['2026-09-10'] ?? null)->toBe(12);
    if ($source instanceof Matomo) {
        parse_str((string)$history[0]['request']->getBody(), $query);
        expect($query['period'])->toBe('day');
    }
})->with([
    [Umami::class, ['apiKey' => 'fixture'], ['pageviews' => [['x' => '2026-09-10', 'y' => 12]]], 'pageviews'],
    [SimpleAnalytics::class, ['hostname' => 'fixture.invalid'], ['histogram' => [['date' => '2026-09-10', 'pageviews' => 12]]], 'pageviews'],
    [GoatCounter::class, ['siteUrl' => 'https://fixture.invalid', 'apiKey' => 'fixture'], ['stats' => [['day' => '2026-09-10', 'daily' => 12]]], 'visitors'],
    [Pirsch::class, [], [['day' => '2026-09-10', 'views' => 12]], 'pageviews'],
    [Matomo::class, ['apiUrl' => 'https://fixture.invalid'], ['2026-09-10' => ['nb_visits' => 12]], 'nb_visits'],
]);
