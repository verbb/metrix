<?php
namespace verbb\metrix\sources;

use verbb\metrix\base\CredentialsSource;
use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetDataInterface;
use verbb\metrix\widgets\data\PlotData;

use Craft;
use craft\helpers\App;

use Throwable;

use GuzzleHttp\Client;

class SimpleAnalytics extends CredentialsSource
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Simple Analytics');
    }


    // Properties
    // =========================================================================

    public static string $providerHandle = 'simple-analytics';

    public ?string $hostname = null;
    public ?string $apiKey = null;
    public ?string $timezone = 'UTC';


    // Public Methods
    // =========================================================================

    public function defineRules(): array
    {
        $rules = parent::defineRules();

        $rules[] = [['hostname'], 'required', 'when' => fn($model) => $model->enabled];

        return $rules;
    }

    public function getPrimaryColor(): ?string
    {
        return '#FF5533';
    }

    public function getIcon(): ?string
    {
        return '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 3h18v4H3V3zm0 6h10v12H3V9zm12 0h6v12h-6V9z"/></svg>';
    }

    public function getHostname(): ?string
    {
        return App::parseEnv($this->hostname);
    }

    public function getApiKey(): ?string
    {
        return App::parseEnv($this->apiKey);
    }

    public function getTimezone(): string
    {
        return App::parseEnv($this->timezone) ?: 'UTC';
    }

    public function fetchAvailableMetrics(): array
    {
        $metrics = [
            'pageviews' => 'Page Views',
            'visitors' => 'Unique Visitors',
        ];

        return array_map(fn($key, $label) => [
            'label' => $label,
            'value' => $key,
        ], array_keys($metrics), $metrics);
    }

    public function fetchAvailableDimensions(): array
    {
        $dimensions = [
            'pages' => 'Page',
            'referrers' => 'Referrer',
            'countries' => 'Country',
            'browser_names' => 'Browser',
            'os_names' => 'Operating System',
            'device_types' => 'Device Type',
            'utm_sources' => 'UTM Source',
            'utm_mediums' => 'UTM Medium',
        ];

        return array_map(fn($key, $label) => [
            'label' => $label,
            'value' => $key,
        ], array_keys($dimensions), $dimensions);
    }

    public function fetchData(WidgetDataInterface $widgetData): array
    {
        if ($widgetData->widget::supportsDimensions() && $widgetData->dimension) {
            return $this->_fetchDimensionData($widgetData);
        }

        if ($widgetData->widget::getDataType() === PlotData::class) {
            return $this->_fetchPlotData($widgetData);
        }

        return $this->_fetchCounterData($widgetData);
    }

    public function fetchConnection(): bool
    {
        try {
            $this->_fetchStats([
                'fields' => 'pageviews',
                'start' => 'today-7d',
                'end' => 'today',
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

        $headers = [
            'Accept' => 'application/json',
        ];

        if ($apiKey = $this->getApiKey()) {
            $headers['Api-Key'] = $apiKey;
        }

        return $this->_client = Craft::createGuzzleClient([
            'base_uri' => 'https://simpleanalytics.com/',
            'headers' => $headers,
        ]);
    }


    // Protected Methods
    // =========================================================================

    protected function getCanonicalMetricMap(): array
    {
        return [
            'visitors' => 'visitors',
            'pageviews' => 'pageviews',
        ];
    }

    protected function getCanonicalDimensionMap(): array
    {
        return [
            'page' => 'pages',
            'referrer' => 'referrers',
            'source' => 'utm_sources',
            'country' => 'countries',
            'device' => 'device_types',
            'browser' => 'browser_names',
            'os' => 'os_names',
        ];
    }


    // Private Methods
    // =========================================================================

    private function _fetchCounterData(WidgetDataInterface $widgetData): array
    {
        $response = $this->_fetchStats($this->_getBaseQuery($widgetData, [
            'fields' => $widgetData->metric,
        ]));

        return ['total' => $response[$widgetData->metric] ?? 0];
    }

    private function _fetchPlotData(WidgetDataInterface $widgetData): array
    {
        $response = $this->_fetchStats($this->_getBaseQuery($widgetData, [
            'fields' => 'histogram',
            'interval' => $this->_getHistogramInterval($widgetData),
        ]));

        $data = [];

        foreach ($response['histogram'] ?? [] as $row) {
            $date = $row['date'] ?? null;

            if (!$date) {
                continue;
            }

            $data[$date] = $row[$widgetData->metric] ?? $row['pageviews'] ?? 0;
        }

        return $data;
    }

    private function _fetchDimensionData(WidgetDataInterface $widgetData): array
    {
        $response = $this->_fetchStats($this->_getBaseQuery($widgetData, [
            'fields' => $widgetData->dimension,
            'limit' => 100,
        ]));

        $data = [];
        $rows = $response[$widgetData->dimension] ?? [];

        foreach ($rows as $row) {
            $label = $row['value'] ?? $row['path'] ?? $row['referrer'] ?? $row['country'] ?? null;

            if (!$label) {
                continue;
            }

            $data[$label] = $row[$widgetData->metric] ?? $row['pageviews'] ?? $row['visitors'] ?? 0;
        }

        return $data;
    }

    private function _fetchStats(array $query): array
    {
        $hostname = $this->getHostname();

        return $this->request('GET', $hostname . '.json', [
            'query' => array_merge([
                'version' => 6,
                'timezone' => $this->getTimezone(),
            ], $query),
        ]);
    }

    private function _getBaseQuery(WidgetDataInterface $widgetData, array $extra = []): array
    {
        $dateRange = $widgetData->period::getCurrentDateRange();

        return array_merge([
            'start' => $dateRange['start']->format('Y-m-d'),
            'end' => $dateRange['end']->format('Y-m-d'),
        ], $extra);
    }

    private function _getHistogramInterval(WidgetDataInterface $widgetData): string
    {
        return match ($widgetData->period::getIntervalDimension()) {
            Period::INTERVAL_HOUR => 'hour',
            Period::INTERVAL_MONTH, Period::INTERVAL_YEAR => 'month',
            default => 'day',
        };
    }
}
