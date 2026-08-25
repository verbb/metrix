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

class Pirsch extends CredentialsSource
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Pirsch');
    }


    // Properties
    // =========================================================================

    public static string $providerHandle = 'pirsch';

    public ?string $clientId = null;
    public ?string $clientSecret = null;
    public ?string $domainId = null;


    // Public Methods
    // =========================================================================

    public function defineRules(): array
    {
        $rules = parent::defineRules();

        $rules[] = [['clientId', 'clientSecret', 'domainId'], 'required', 'when' => fn($model) => $model->enabled];

        return $rules;
    }

    public function getPrimaryColor(): ?string
    {
        return '#1F2937';
    }

    public function getIcon(): ?string
    {
        return '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 14.5h-2v-6h2v6zm0-8h-2V6h2v2.5z"/></svg>';
    }

    public function getClientId(): ?string
    {
        return App::parseEnv($this->clientId);
    }

    public function getClientSecret(): ?string
    {
        return App::parseEnv($this->clientSecret);
    }

    public function getDomainId(): ?string
    {
        return App::parseEnv($this->domainId);
    }

    public function fetchSourceSettings(string $settingsKey): ?array
    {
        try {
            if ($settingsKey === 'domainId') {
                $options = [];
                $response = $this->request('GET', 'api/v1/domain');

                foreach ($response as $domain) {
                    $options[] = [
                        'label' => $domain['display_name'] ?? $domain['hostname'] ?? $domain['id'],
                        'value' => $domain['id'],
                    ];
                }

                usort($options, fn($a, $b) => strcmp($a['label'], $b['label']));

                return $options;
            }
        } catch (Throwable $e) {
            self::apiError($this, $e);
        }

        return parent::fetchSourceSettings($settingsKey);
    }

    public function fetchAvailableMetrics(): array
    {
        $metrics = [
            'visitors' => 'Unique Visitors',
            'views' => 'Page Views',
            'sessions' => 'Sessions',
            'bounce_rate' => 'Bounce Rate',
            'avg_duration' => 'Average Time Spent',
        ];

        return array_map(fn($key, $label) => [
            'label' => $label,
            'value' => $key,
        ], array_keys($metrics), $metrics);
    }

    public function fetchAvailableDimensions(): array
    {
        $dimensions = [
            'page' => 'Page',
            'entry_page' => 'Entry Page',
            'referrer' => 'Referrer',
            'country' => 'Country',
            'browser' => 'Browser',
            'os' => 'Operating System',
            'language' => 'Language',
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

    public function fetchRealtimeData(WidgetDataInterface $widgetData): array
    {
        $response = $this->request('GET', 'api/v1/statistics/active', [
            'query' => [
                'id' => $this->getDomainId(),
                'start' => 300,
            ],
        ]);

        return [
            Craft::t('metrix', 'Active visitors') => $response['visitors'] ?? 0,
        ];
    }

    public function fetchConnection(): bool
    {
        try {
            $this->request('GET', 'api/v1/domain');
        } catch (Throwable $e) {
            self::apiError($this, $e);

            return false;
        }

        return true;
    }

    public function request(string $method, string $url, array $options = []): mixed
    {
        $options['headers'] = array_merge($options['headers'] ?? [], [
            'Authorization' => 'Bearer ' . $this->_getAccessToken(),
            'Accept' => 'application/json',
        ]);

        return parent::request($method, $url, $options);
    }

    public function getClient(): Client
    {
        if ($this->_client) {
            return $this->_client;
        }

        return $this->_client = Craft::createGuzzleClient([
            'base_uri' => 'https://api.pirsch.io/',
        ]);
    }


    // Protected Methods
    // =========================================================================

    protected function getCanonicalMetricMap(): array
    {
        return [
            'visitors' => 'visitors',
            'pageviews' => 'views',
            'sessions' => 'sessions',
            'bounce_rate' => 'bounce_rate',
            'avg_duration' => 'avg_duration',
        ];
    }

    protected function getCanonicalDimensionMap(): array
    {
        return [
            'page' => 'page',
            'entry_page' => 'entry_page',
            'referrer' => 'referrer',
            'country' => 'country',
            'browser' => 'browser',
            'os' => 'os',
        ];
    }


    // Private Methods
    // =========================================================================

    private function _fetchCounterData(WidgetDataInterface $widgetData): array
    {
        $response = $this->request('GET', 'api/v1/statistics/total', [
            'query' => $this->_getFilterQuery($widgetData),
        ]);

        $value = match ($widgetData->metric) {
            'bounce_rate' => round(((float)($response['bounce_rate'] ?? 0)) * 100, 2),
            'avg_duration' => $this->_averageDurationFromPages($widgetData),
            default => $response[$widgetData->metric] ?? 0,
        };

        return ['total' => $value];
    }

    private function _fetchPlotData(WidgetDataInterface $widgetData): array
    {
        $response = $this->request('GET', 'api/v1/statistics/visitor', [
            'query' => array_merge($this->_getFilterQuery($widgetData), [
                'scale' => $this->_getScale($widgetData),
            ]),
        ]);

        $metricField = $this->_getVisitorMetricField($widgetData->metric);
        $data = [];

        foreach ($response as $row) {
            $timestamp = $row['day'] ?? $row['week'] ?? $row['month'] ?? $row['year'] ?? null;

            if (!$timestamp) {
                continue;
            }

            $key = $this->_normalizeTimestampKey($timestamp, $widgetData);
            $data[$key] = $row[$metricField] ?? 0;
        }

        return $data;
    }

    private function _fetchDimensionData(WidgetDataInterface $widgetData): array
    {
        $endpoint = match ($widgetData->dimension) {
            'page' => 'api/v1/statistics/page',
            'entry_page' => 'api/v1/statistics/page/entry',
            'referrer' => 'api/v1/statistics/referrer',
            'country' => 'api/v1/statistics/country',
            'browser' => 'api/v1/statistics/browser',
            'os' => 'api/v1/statistics/os',
            'language' => 'api/v1/statistics/language',
            default => 'api/v1/statistics/page',
        };

        $response = $this->request('GET', $endpoint, [
            'query' => $this->_getFilterQuery($widgetData),
        ]);

        $data = [];
        $metricField = $this->_getBreakdownMetricField($widgetData->metric);

        foreach ($response as $row) {
            $label = $row['path']
                ?? $row['referrer_name']
                ?? $row['referrer']
                ?? $row['country_code']
                ?? $row['browser']
                ?? $row['os']
                ?? $row['language']
                ?? null;

            if (!$label) {
                continue;
            }

            $data[$label] = $row[$metricField] ?? 0;
        }

        return $data;
    }

    private function _getAccessToken(): string
    {
        $cachedToken = $this->getSettingCache('accessToken');
        $cachedExpiry = $this->getSettingCache('accessTokenExpires');

        if ($cachedToken && $cachedExpiry && strtotime($cachedExpiry) > time() + 60) {
            return $cachedToken;
        }

        $client = Craft::createGuzzleClient([
            'base_uri' => 'https://api.pirsch.io/',
            'headers' => [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ],
        ]);

        $response = $client->request('POST', 'api/v1/token', [
            'json' => [
                'client_id' => $this->getClientId(),
                'client_secret' => $this->getClientSecret(),
            ],
        ]);

        $payload = json_decode($response->getBody()->getContents(), true);
        $token = $payload['access_token'] ?? null;
        $expiresAt = $payload['expires_at'] ?? null;

        if (!$token) {
            throw new \Exception(Craft::t('metrix', 'Unable to authenticate with Pirsch.'));
        }

        $this->setSettingCache([
            'accessToken' => $token,
            'accessTokenExpires' => $expiresAt,
        ]);

        return $token;
    }

    private function _getFilterQuery(WidgetDataInterface $widgetData): array
    {
        $dateRange = $widgetData->period::getCurrentDateRange();

        return [
            'id' => $this->getDomainId(),
            'from' => $dateRange['start']->format('Y-m-d'),
            'to' => $dateRange['end']->format('Y-m-d'),
        ];
    }

    private function _getScale(WidgetDataInterface $widgetData): string
    {
        return match ($widgetData->period::getIntervalDimension()) {
            Period::INTERVAL_MONTH, Period::INTERVAL_YEAR => 'month',
            default => 'day',
        };
    }

    private function _normalizeTimestampKey(string $timestamp, WidgetDataInterface $widgetData): string
    {
        $date = new \DateTime($timestamp);

        return match ($widgetData->period::getIntervalDimension()) {
            Period::INTERVAL_MONTH => $date->format('Y-m'),
            Period::INTERVAL_YEAR => $date->format('Y'),
            default => $date->format('Y-m-d'),
        };
    }

    private function _getVisitorMetricField(string $metric): string
    {
        return match ($metric) {
            'views', 'pageviews' => 'views',
            'sessions' => 'sessions',
            'bounce_rate' => 'bounce_rate',
            default => 'visitors',
        };
    }

    private function _getBreakdownMetricField(string $metric): string
    {
        return match ($metric) {
            'views', 'pageviews' => 'views',
            'sessions' => 'sessions',
            default => 'visitors',
        };
    }

    private function _averageDurationFromPages(WidgetDataInterface $widgetData): float
    {
        $response = $this->request('GET', 'api/v1/statistics/page', [
            'query' => $this->_getFilterQuery($widgetData),
        ]);

        $totalSeconds = 0.0;
        $count = 0;

        foreach ($response as $row) {
            if (!isset($row['average_time_spent_seconds'])) {
                continue;
            }

            $totalSeconds += (float)$row['average_time_spent_seconds'];
            $count++;
        }

        if (!$count) {
            return 0.0;
        }

        return round($totalSeconds / $count);
    }
}
