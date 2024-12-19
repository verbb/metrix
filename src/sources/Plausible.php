<?php
namespace verbb\metrix\sources;

use verbb\metrix\base\CredentialsSource;
use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetDataInterface;

use Craft;
use craft\helpers\App;
use craft\helpers\Json;

use DateTime;
use Throwable;

use GuzzleHttp\Client;

class Plausible extends CredentialsSource
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Plausible');
    }


    // Properties
    // =========================================================================

    public static string $providerHandle = 'plausible';

    public ?string $apiKey = null;
    public ?string $siteId = null;


    // Public Methods
    // =========================================================================

    public function defineRules(): array
    {
        $rules = parent::defineRules();

        $rules[] = [['apiKey', 'siteId'], 'required', 'when' => fn($model) => $model->enabled];

        return $rules;
    }

    public function getPrimaryColor(): ?string
    {
        return '#4f46e5';
    }

    public function getIcon(): ?string
    {
        return '<svg viewBox="0 0 45.36 60">
            <path fill="currentColor" d="m45.25,22.6c-1.09,10.46-10.23,18.23-20.75,18.23h-4.05v9.57c0,5.3-4.3,9.6-9.6,9.6H3.36c-1.86,0-3.36-1.5-3.36-3.36v-19.7l5.04-7.07c.91-1.28,2.59-1.76,4.04-1.15l2.87,1.2c1.44.61,3.12.13,4.02-1.15l6.72-9.42c.91-1.27,2.57-1.75,4.01-1.14l5.52,2.32c1.44.61,3.11.13,4.02-1.14l6.46-9.06c2.02,3.56,3.01,7.79,2.55,12.27Z"/>
            <path fill="currentColor" d="m3.29,28.87c.82-1.16,2.02-2.04,3.41-2.31,1.09-.21,2.16-.1,3.15.32l2.86,1.2c.17.07.34.1.52.1.44,0,.85-.21,1.1-.57l6.59-9.24c.82-1.15,2.02-2.04,3.41-2.31,1.08-.21,2.15-.1,3.13.31l5.52,2.32c.17.07.34.11.52.11.44,0,.85-.21,1.1-.57l6.92-9.71C37.83,3.36,31.78,0,24.95,0H3.36C1.5,0,0,1.5,0,3.36v30.13l3.29-4.62Z"/>
        </svg>';
    }

    public function getApiKey(): ?string
    {
        return App::parseEnv($this->apiKey);
    }

    public function getSiteId(): ?string
    {
        return App::parseEnv($this->siteId);
    }

    public function fetchAvailableMetrics(): array
    {
        // Hardcoded list of metrics based on Plausible documentation
        $metrics = [
            'visitors' => 'Unique Visitors',
            'pageviews' => 'Page Views',
            'bounce_rate' => 'Bounce Rate',
            'visit_duration' => 'Visit Duration',
            'events' => 'Events',
        ];

        return array_map(fn($key, $label) => [
            'label' => $label,
            'value' => $key,
        ], array_keys($metrics), $metrics);
    }

    public function fetchAvailableDimensions(): array
    {
        // Hardcoded list of dimensions based on Plausible documentation
        $dimensions = [
            'visit:source' => 'Source',
            'visit:referrer' => 'Referrer',
            'visit:device' => 'Device',
            'visit:browser' => 'Browser',
            'visit:country' => 'Country',
            'visit:entry_page' => 'Entry Page',
            'visit:exit_page' => 'Exit Page',
            'visit:page' => 'Page',
        ];

        return array_map(fn($key, $label) => [
            'label' => $label,
            'value' => $key,
        ], array_keys($dimensions), $dimensions);
    }

    public function fetchData(WidgetDataInterface $widgetData): array
    {
        $intervalDimension = $this->_getIntervalDimension($widgetData);
        $dateRange = $widgetData->period::getCurrentDateRange();
        $startDate = $dateRange['start']->format('Y-m-d');
        $endDate = $dateRange['end']->format('Y-m-d');

        $payload = [
            'site_id' => $this->getSiteId(),
            'date_range' => [$startDate, $endDate],
            'metrics' => [$widgetData->metric],
        ];

        if ($widgetData->widget::supportsDimensions() && $widgetData->dimension) {
            $payload['dimensions'][] = $widgetData->dimension;
        } else {
            $payload['dimensions'][] = $intervalDimension;
        }

        $response = $this->request('POST', 'query', [
            'json' => $payload,
        ]);

        $results = $response['results'] ?? [];

        $data = [];

        foreach ($results as $result) {
            $metric = $result['metrics'][0] ?? null;
            $dimension = $result['dimensions'][0] ?? null;

            if ($dimension) {
                $data[$dimension] = $metric;
            }
        }

        return $data;
    }

    public function fetchRealtimeData(WidgetDataInterface $widgetData): array
    {
        $response = $this->request('GET', 'https://plausible.io/api/v1/stats/realtime/visitors', [
            'query' => [
                'site_id' => $this->getSiteId(),
            ],
        ]);

        return [
            Craft::t('metrix', 'Active users') => $response,
        ];
    }

    public function fetchConnection(): bool
    {
        try {
            $this->request('POST', 'query', [
                'json' => [
                    'site_id' => $this->getSiteId(),
                    'metrics' => ['visitors'],
                    'date_range' => '7d',
                ],
            ]);
        } catch (Throwable $e) {
            self::apiError($this, $e);

            return false;
        }

        return true;
    }

    public function getClient(): Client
    {
        if ($this->_client) {
            return $this->_client;
        }

        return $this->_client = Craft::createGuzzleClient([
            'base_uri' => 'https://plausible.io/api/v2/',
            'headers' => ['Authorization' => 'Bearer ' . $this->getApiKey()],
        ]);
    }


    // Private Methods
    // =========================================================================

    private function _getIntervalDimension(WidgetDataInterface $widgetData): string
    {
        $intervalDimension = $widgetData->period::getIntervalDimension();

        if ($intervalDimension === Period::INTERVAL_HOUR) {
            return 'time:hour';
        }

        if ($intervalDimension === Period::INTERVAL_DAY) {
            return 'time:day';
        }

        if ($intervalDimension === Period::INTERVAL_MONTH) {
            return 'time:month';
        }

        return 'time:day';
    }
}