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
        ->and($data)->toBe(['total' => 25.5]);
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

it('loads every Google account and property page before sorting choices', function(string $key, string $resource) {
    $source = new class extends GoogleAnalytics {
        public array $requests = [];
        public array $responses = [];

        public function request(string $method = 'GET', string $uri = '', array $options = [])
        {
            $this->requests[] = ['uri' => $uri, 'query' => $options['query'] ?? []];
            return array_shift($this->responses);
        }
    };
    $source->accountId = 'accounts/42';
    $source->responses = [
        [$resource => [['displayName' => 'Zulu', 'name' => $resource . '/1']], 'nextPageToken' => 'second-page'],
        [$resource => [['displayName' => 'Alpha', 'name' => $resource . '/2']]],
    ];

    expect($source->fetchSourceSettings($key))->toBe([
        ['label' => 'Alpha', 'value' => $resource . '/2'],
        ['label' => 'Zulu', 'value' => $resource . '/1'],
    ])->and($source->requests)->toHaveCount(2)
        ->and($source->requests[1]['query']['pageToken'])->toBe('second-page')
        ->and($source->requests[1]['uri'])->toBe('https://analyticsadmin.googleapis.com/v1beta/' . $resource);

    if ($resource === 'properties') {
        expect(array_column(array_column($source->requests, 'query'), 'filter'))->toBe(['parent:accounts/42', 'parent:accounts/42']);
    }
})->with([['accountId', 'accounts'], ['propertyId', 'properties']]);
