<?php

declare(strict_types=1);

use verbb\metrix\base\WidgetData;
use verbb\metrix\models\AnalyticsScope;
use verbb\metrix\periods\Last7Days;
use verbb\metrix\sources\GoogleAnalytics;
use verbb\metrix\widgets\Counter;
use verbb\metrix\widgets\Table;

beforeEach(function() {
    $this->google = new class extends GoogleAnalytics {
        public array $requests = [];
        public array $response = [];

        public function request(string $method = 'GET', string $uri = '', array $options = [])
        {
            $this->requests[] = $options['json'] ?? [];
            return $this->response;
        }
    };
});

it('requests and reads Google Analytics totals without time dimensions', function() {
    $this->google->response = ['rows' => [['metricValues' => [['value' => '0.255']]]]];
    $data = $this->google->fetchData(new WidgetData(['widget' => new Counter(), 'metric' => 'bounceRate', 'period' => Last7Days::class]));

    expect($this->google->requests[0]['dimensions'] ?? [])->toBe([])
        ->and($data)->toBe(['total' => '0.255']);
});

it('requests the highest Google Analytics dimension values before limiting rows', function() {
    $this->google->response = ['rows' => [['dimensionValues' => [['value' => '0']], 'metricValues' => [['value' => '12']]]]];
    $data = $this->google->fetchData(new WidgetData(['widget' => new Table(), 'metric' => 'activeUsers', 'dimension' => 'pagePath', 'period' => Last7Days::class, 'limit' => 5]));

    expect($this->google->requests[0]['orderBys'] ?? [])->toBe([['metric' => ['metricName' => 'activeUsers'], 'desc' => true]])
        ->and($data)->toBe([0 => '12']);
});

it('explains unsupported scoped Google realtime queries before making a request', function() {
    $scope = new AnalyticsScope(['mode' => AnalyticsScope::MODE_PATH, 'pathPrefix' => '/news']);
    $widgetData = new WidgetData(['scope' => $scope]);

    expect(fn() => $this->google->fetchRealtimeData($widgetData))->toThrow(Exception::class, 'does not support hostname or path filters');
    expect($this->google->requests)->toBe([]);
});
