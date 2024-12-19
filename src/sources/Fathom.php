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

class Fathom extends CredentialsSource
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Fathom');
    }


    // Properties
    // =========================================================================

    public static string $providerHandle = 'fathom';

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
        return '#565b8d';
    }

    public function getIcon(): ?string
    {
        return '<svg viewBox="0 0 512 512"><path fill="currentColor" d="..."></path></svg>';
    }

    public function getApiKey(): ?string
    {
        return App::parseEnv($this->apiKey);
    }

    public function getSiteId(): ?string
    {
        return App::parseEnv($this->siteId);
    }

    public function fetchSourceSettings(string $settingsKey): ?array
    {
        try {
            if ($settingsKey === 'siteId') {
                $options = [];

                $response = $this->request('GET', 'sites');
                $sites = $response['data'] ?? [];

                foreach ($sites as $site) {
                    $options[] = [
                        'label' => $site['name'],
                        'value' => $site['id'],
                    ];
                }

                // Sort the options alphabetically by label
                usort($options, function ($a, $b) {
                    return strcmp($a['label'], $b['label']);
                });

                return $options;
            }
        } catch (Throwable $e) {
            self::apiError($this, $e);
        }

        return parent::fetchSourceSettings($settingsKey);
    }

    public function fetchAvailableMetrics(): array
    {
        // Hardcoded list of metrics based on Fathom documentation
        $metrics = [
            'pageviews' => 'Pageviews',
            'visitors' => 'Unique Visitors',
            'avg_duration' => 'Average Visit Duration',
            'bounce_rate' => 'Bounce Rate',
        ];

        return array_map(fn($key, $label) => [
            'label' => $label,
            'value' => $key,
        ], array_keys($metrics), $metrics);
    }

    public function fetchAvailableDimensions(): array
    {
        // Hardcoded list of dimensions based on Fathom documentation
        $dimensions = [
            'referrer' => 'Referrer',
            'utm_source' => 'UTM Source',
            'utm_medium' => 'UTM Medium',
            'page' => 'Page',
            'country' => 'Country',
        ];

        return array_map(fn($key, $label) => [
            'label' => $label,
            'value' => $key,
        ], array_keys($dimensions), $dimensions);
    }

    public function fetchData(WidgetDataInterface $widgetData): array
    {
        $dateRange = $widgetData->period::getCurrentDateRange();
        $startDate = $dateRange['start']->format('Y-m-d');
        $endDate = $dateRange['end']->format('Y-m-d');

        $metrics = [$widgetData->metric];
        $dimensions = $widgetData->dimension ? [$widgetData->dimension] : [];

        $payload = [
            'entity' => 'pageview',
            'entity_id' => $this->getSiteId(),
            'aggregates' => implode(',', $metrics),
            'date_grouping' => $this->_getIntervalDimension($widgetData),
            'timezone' => 'UTC',
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];

        $response = $this->request('GET', 'aggregations', [
            'query' => $payload,
        ]);

        $data = [];

        foreach ($response as $result) {
            $metric = $result[$widgetData->metric] ?? null;
            $dimension = $result['date'] ?? null;

            if ($dimension) {
                $data[$dimension] = $metric;
            }
        }

        return $data;
    }

    public function fetchRealtimeData(WidgetDataInterface $widgetData): array
    {
        $response = $this->request('GET', 'current_visitors', [
            'query' => [
                'site_id' => $this->getSiteId(),
            ],
        ]);

        $activeVisitors = $response['total'] ?? 0;

        return [
            Craft::t('metrix', 'Active visitors') => $activeVisitors,
        ];
    }

    public function fetchConnection(): bool
    {
        try {
            $this->request('GET', 'account');
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
            'base_uri' => 'https://api.usefathom.com/v1/',
            'headers' => ['Authorization' => 'Bearer ' . $this->getApiKey()],
        ]);
    }


    // Private Methods
    // =========================================================================

    private function _getIntervalDimension(WidgetDataInterface $widgetData): string
    {
        $intervalDimension = $widgetData->period::getIntervalDimension();

        if ($intervalDimension === Period::INTERVAL_HOUR) {
            return 'hour';
        }

        if ($intervalDimension === Period::INTERVAL_DAY) {
            return 'day';
        }

        if ($intervalDimension === Period::INTERVAL_MONTH) {
            return 'month';
        }

        return 'day';
    }
}