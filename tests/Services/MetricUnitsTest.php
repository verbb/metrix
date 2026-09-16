<?php

declare(strict_types=1);

use Tests\Support\ProviderHttp;
use verbb\metrix\base\WidgetData;
use verbb\metrix\periods\AllTime;
use verbb\metrix\periods\Today;
use verbb\metrix\sources\GoogleAnalytics;
use verbb\metrix\sources\Matomo;
use verbb\metrix\sources\Plausible;
use verbb\metrix\widgets\Counter;
use verbb\metrix\widgets\Line;
use verbb\metrix\widgets\Table;
use verbb\metrix\widgets\data\CounterData;
use verbb\metrix\widgets\data\DimensionData;
use verbb\metrix\widgets\data\PlotData;

it('normalizes Google bounce-rate fractions for every report shape', function(string $type) {
    $source = new class(['propertyId' => 'properties/fixture']) extends GoogleAnalytics {
        public function request(string $method = 'GET', string $uri = '', array $options = [])
        {
            return ['rows' => [['metricValues' => [['value' => '0.2761']], 'dimensionValues' => [['value' => '01']]]]];
        }
    };
    $data = $source->fetchData(new WidgetData(['widget' => new $type(), 'period' => Today::class, 'metric' => 'bounceRate']));
    expect(array_values($data))->toBe([27.61]);
})->with([Counter::class, Line::class, Table::class]);

it('normalizes Matomo unformatted rates and preserves formatted legacy percentages', function(string $type, float|string $value) {
    $source = new Matomo(['apiUrl' => 'https://example.test', 'apiToken' => 'fixture']);
    $history = [];
    $response = $type === Table::class ? [['label' => 'AU', 'bounce_rate' => $value]] : ['bounce_rate' => $value];
    ProviderHttp::mock($source, [$response], $history);
    $data = $source->fetchData(new WidgetData(['widget' => new $type(), 'period' => Today::class, 'metric' => 'bounce_rate', 'dimension' => $type === Table::class ? 'country' : null]));
    expect(array_values($data))->toBe([27.61]);
})->with([Counter::class, Table::class])->with([0.2761, '27.61%']);

it('retains metric units in counter dimension and plot column metadata', function(string $transformer, string $widgetType, string $canonical, string $format) {
    $source = new Plausible();
    $widget = new $widgetType(['canonicalMetric' => $canonical, 'canonicalDimension' => 'country']);
    $widget->setSource($source);
    $data = new $transformer(['widget' => $widget, 'source' => $source, 'period' => AllTime::class, 'metric' => $source->resolveCanonicalMetric($canonical)]);
    $formatted = (new ReflectionMethod($data, 'formatData'))->invoke($data, ['2026-09-16' => 27.61]);
    $column = $formatted['cols'][$transformer === CounterData::class ? 0 : 1];
    expect($column['labelFormat'])->toBe($format);
    if ($transformer === PlotData::class) expect($column['tooltipFormat'])->toBe($format);
})->with([
    [CounterData::class, Counter::class],
    [DimensionData::class, Table::class],
    [PlotData::class, Line::class],
])->with([['bounce_rate', 'percentage'], ['avg_duration', 'duration']]);
