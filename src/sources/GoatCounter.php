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

class GoatCounter extends CredentialsSource
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'GoatCounter');
    }


    // Properties
    // =========================================================================

    public static string $providerHandle = 'goat-counter';

    public ?string $siteUrl = null;
    public ?string $apiKey = null;


    // Public Methods
    // =========================================================================

    public function defineRules(): array
    {
        $rules = parent::defineRules();

        $rules[] = [['siteUrl', 'apiKey'], 'required', 'when' => fn($model) => $model->enabled];

        return $rules;
    }

    public function getPrimaryColor(): ?string
    {
        return '#953B39';
    }

    public function getIcon(): ?string
    {
        return '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 18c0-2.5 1.5-4.7 3.7-5.7C6.8 10.8 6 8.5 6 6c0-3.3 2.7-6 6-6s6 2.7 6 6c0 2.5-.8 4.8-1.7 6.3C18.5 13.3 20 15.5 20 18v2H4v-2zm4-10a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/></svg>';
    }

    public function getSiteUrl(): string
    {
        return rtrim(App::parseEnv($this->siteUrl) ?: '', '/');
    }

    public function getApiKey(): ?string
    {
        return App::parseEnv($this->apiKey);
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
            'toprefs' => 'Referrer',
            'locations' => 'Country',
            'browsers' => 'Browser',
            'systems' => 'Operating System',
            'sizes' => 'Screen Size',
            'languages' => 'Language',
            'campaigns' => 'Campaign',
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
            $this->request('GET', 'api/v0/me');
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
            'base_uri' => $this->getSiteUrl() . '/',
            'headers' => [
                'Authorization' => 'Bearer ' . $this->getApiKey(),
                'Accept' => 'application/json',
            ],
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
            'referrer' => 'toprefs',
            'country' => 'locations',
            'browser' => 'browsers',
            'os' => 'systems',
        ];
    }


    // Private Methods
    // =========================================================================

    private function _fetchCounterData(WidgetDataInterface $widgetData): array
    {
        $response = $this->request('GET', 'api/v0/stats/total', [
            'query' => $this->_getDateQuery($widgetData),
        ]);

        $value = $widgetData->metric === 'pageviews'
            ? ($response['total'] ?? 0)
            : ($response['total'] ?? 0);

        return ['total' => $value];
    }

    private function _fetchPlotData(WidgetDataInterface $widgetData): array
    {
        $response = $this->request('GET', 'api/v0/stats/total', [
            'query' => $this->_getDateQuery($widgetData),
        ]);

        $data = [];

        foreach ($response['stats'] ?? [] as $row) {
            $day = $row['day'] ?? null;

            if (!$day) {
                continue;
            }

            $key = (new \DateTime($day))->format('Y-m-d');
            $data[$key] = $row['daily'] ?? 0;
        }

        return $data;
    }

    private function _fetchDimensionData(WidgetDataInterface $widgetData): array
    {
        if ($widgetData->dimension === 'pages') {
            $response = $this->request('GET', 'api/v0/stats/hits', [
                'query' => array_merge($this->_getDateQuery($widgetData), [
                    'limit' => 100,
                ]),
            ]);

            $data = [];

            foreach ($response['hits'] ?? [] as $row) {
                $path = $row['path'] ?? null;

                if (!$path) {
                    continue;
                }

                $data[$path] = $row['count'] ?? 0;
            }

            return $data;
        }

        $response = $this->request('GET', 'api/v0/stats/' . $widgetData->dimension, [
            'query' => array_merge($this->_getDateQuery($widgetData), [
                'limit' => 100,
            ]),
        ]);

        $data = [];

        foreach ($response['stats'] ?? [] as $row) {
            $name = $row['name'] ?? null;

            if (!$name) {
                continue;
            }

            $data[$name] = $row['count'] ?? 0;
        }

        return $data;
    }

    private function _getDateQuery(WidgetDataInterface $widgetData): array
    {
        $dateRange = $widgetData->period::getCurrentDateRange();

        return [
            'start' => $dateRange['start']->format('Y-m-d\T00:00:00\Z'),
            'end' => $dateRange['end']->format('Y-m-d\T23:59:59\Z'),
        ];
    }
}
