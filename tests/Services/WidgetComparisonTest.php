<?php

declare(strict_types=1);

use verbb\metrix\Metrix;
use verbb\metrix\base\WidgetDataInterface;
use verbb\metrix\models\AnalyticsScope;
use verbb\metrix\models\View;
use verbb\metrix\periods\Today;
use verbb\metrix\sources\Plausible;
use verbb\metrix\widgets\Counter;
use verbb\metrix\widgets\Line;

beforeEach(function() {
    $this->comparisonCacheEnabled = Metrix::$plugin->getSettings()->enableCache;
    $this->comparisonCacheDuration = Metrix::$plugin->getSettings()->cacheDuration;
    Metrix::$plugin->getSettings()->enableCache = true;
    Metrix::$plugin->getSettings()->cacheDuration = 'PT10M';

    $this->comparisonSource = new class extends Plausible {
        private array $requests = [];

        public function getRequests(): array
        {
            return $this->requests;
        }

        public function fetchData(WidgetDataInterface $data): array
        {
            $range = $data->period::getCurrentDateRange();
            $previous = $range['start']->format('Y-m-d') !== date('Y-m-d');
            $path = $data->scope?->getResolvedPathPrefix();
            $this->requests[] = ['previous' => $previous, 'path' => $path];

            return [$range['start']->format('Y-m-d H:00:00') => $previous ? ($path === '/news' ? 10 : 100) : 20];
        }
    };
    $this->comparisonSource->handle = 'comparison-' . bin2hex(random_bytes(8));
});

afterEach(function() {
    Metrix::$plugin->getSettings()->enableCache = $this->comparisonCacheEnabled;
    Metrix::$plugin->getSettings()->cacheDuration = $this->comparisonCacheDuration;
});

function comparisonWidget(string $type, Plausible $source): Counter|Line
{
    $widget = new $type(['period' => Today::class, 'metric' => 'visitors']);
    $widget->setSource($source);
    $widget->setView(new View(['settings' => ['analyticsScope' => [
        'mode' => AnalyticsScope::MODE_PATH,
        'pathPrefix' => '/news',
    ]]]));

    return $widget;
}

it('compares the same analytics scope for counters and plots', function(string $type) {
    $widget = comparisonWidget($type, $this->comparisonSource);
    $data = $widget->getWidgetData();

    expect($this->comparisonSource->getRequests())->toBe([
        ['previous' => false, 'path' => '/news'],
        ['previous' => true, 'path' => '/news'],
    ]);

    if ($type === Counter::class) {
        expect($data['rows'][0])->toBe([20, 100.0]);
    } else {
        expect($data['comparisonRows'][0][1])->toBe(10);
    }
})->with([Counter::class, Line::class]);

it('refreshes both periods while ordinary reloads reuse both caches', function(string $type) {
    $widget = comparisonWidget($type, $this->comparisonSource);
    $widget->getWidgetData();
    $widget->getWidgetData();
    expect($this->comparisonSource->getRequests())->toHaveCount(2);

    $widget->getWidgetData(null, true);
    expect($this->comparisonSource->getRequests())->toHaveCount(4);
})->with([Counter::class, Line::class]);

it('does not cache comparisons when caching is disabled or duration is zero', function(string $type, bool $enabled, string $duration) {
    Metrix::$plugin->getSettings()->enableCache = $enabled;
    Metrix::$plugin->getSettings()->cacheDuration = $duration;
    $widget = comparisonWidget($type, $this->comparisonSource);
    $widget->getWidgetData();
    $widget->getWidgetData();

    expect($this->comparisonSource->getRequests())->toHaveCount(4);
})->with([Counter::class, Line::class])->with([
    'disabled' => [false, 'PT10M'],
    'zero duration' => [true, 'PT0S'],
]);
