<?php
namespace verbb\metrix\sources;

use verbb\metrix\base\CredentialsSource;
use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetDataInterface;
use verbb\metrix\helpers\ProviderUrl;
use verbb\metrix\widgets\data\PlotData;

use Craft;
use craft\helpers\App;

use Exception;
use Throwable;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

class Umami extends CredentialsSource
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Umami');
    }


    // Properties
    // =========================================================================

    public static string $providerHandle = 'umami';

    public ?string $baseUrl = 'https://api.umami.is/';
    public ?string $websiteId = null;
    public ?string $apiKey = null;
    public ?string $username = null;
    public ?string $password = null;


    // Public Methods
    // =========================================================================

    public function defineRules(): array
    {
        $rules = parent::defineRules();

        $rules[] = [['baseUrl', 'websiteId'], 'required', 'when' => fn($model) => $model->enabled];
        $rules[] = [['apiKey'], 'required', 'when' => fn($model) => $model->enabled && !$model->username && !$model->password];
        $rules[] = [['username', 'password'], 'required', 'when' => fn($model) => $model->enabled && !$model->apiKey];

        return $rules;
    }

    public function getPrimaryColor(): ?string
    {
        return '#212121';
    }

    public function getIcon(): ?string
    {
        return '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-7v4h3l-4 7z"/></svg>';
    }

    public function getBaseUrl(): string
    {
        $url = rtrim(App::parseEnv($this->baseUrl) ?: 'https://api.umami.is', '/');

        if (parse_url($url, PHP_URL_HOST) === 'api.umami.is' && !parse_url($url, PHP_URL_PATH)) {
            $url .= '/v1';
        }

        return $url . '/';
    }

    public function getWebsiteId(): ?string
    {
        return App::parseEnv($this->websiteId);
    }

    public function getApiKey(): ?string
    {
        return App::parseEnv($this->apiKey);
    }

    public function getUsername(): ?string
    {
        return App::parseEnv($this->username);
    }

    public function getPassword(): ?string
    {
        return App::parseEnv($this->password);
    }

    public function getEndpointAttributes(): array
    {
        return ['baseUrl'];
    }

    public function fetchSourceSettings(string $settingsKey): ?array
    {
        try {
            if ($settingsKey === 'websiteId') {
                $options = [];
                $response = $this->request('GET', 'api/websites');
                $websites = $response['data'] ?? $response;

                if (!is_array($websites)) {
                    return [];
                }

                foreach ($websites as $website) {
                    $options[] = [
                        'label' => $website['name'] ?? $website['domain'] ?? $website['id'],
                        'value' => $website['id'],
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
            'pageviews' => 'Page Views',
            'visits' => 'Visits',
            'bounces' => 'Bounces',
            'bounce_rate' => 'Bounce Rate',
            'avg_duration' => 'Average Visit Duration',
        ];

        return array_map(fn($key, $label) => [
            'label' => $label,
            'value' => $key,
        ], array_keys($metrics), $metrics);
    }

    public function fetchAvailableDimensions(): array
    {
        $dimensions = [
            'path' => 'Page',
            'entry' => 'Entry Page',
            'referrer' => 'Referrer',
            'channel' => 'Traffic Channel',
            'country' => 'Country',
            'region' => 'Region',
            'browser' => 'Browser',
            'os' => 'Operating System',
            'device' => 'Device',
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

        if (is_a($widgetData->widget::getDataType(), PlotData::class, true)) {
            return $this->_fetchPlotData($widgetData);
        }

        return $this->_fetchCounterData($widgetData);
    }

    public function fetchRealtimeData(WidgetDataInterface $widgetData): array
    {
        $response = $this->request('GET', 'api/websites/' . $this->getWebsiteId() . '/active');

        return [
            Craft::t('metrix', 'Active visitors') => $response['visitors'] ?? 0,
        ];
    }

    public function fetchConnection(): bool
    {
        try {
            [$startAt, $endAt] = $this->_getTimestampRange(null);

            $this->request('GET', 'api/websites/' . $this->getWebsiteId() . '/stats', [
                'query' => [
                    'startAt' => $startAt,
                    'endAt' => $endAt,
                ],
            ]);
        } catch (Throwable $e) {
            self::apiError($this, $e);

            return false;
        }

        return true;
    }

    public function request(string $method, string $url, array $options = []): mixed
    {
        if (parse_url($this->getBaseUrl(), PHP_URL_HOST) === 'api.umami.is' && str_starts_with($url, 'api/')) {
            $url = substr($url, 4);
        }

        $options['headers'] = array_merge($options['headers'] ?? [], [
            'Authorization' => 'Bearer ' . $this->_getBearerToken(),
            'Accept' => 'application/json',
        ]);

        try {
            return parent::request($method, $url, $options);
        } catch (ClientException $e) {
            if ($e->getResponse()->getStatusCode() !== 401 || $this->getApiKey()) {
                throw $e;
            }

            $this->setSettingCache(['authToken' => null, 'authTokenExpires' => null]);
            $options['headers']['Authorization'] = 'Bearer ' . $this->_getBearerToken();

            return parent::request($method, $url, $options);
        }
    }

    public function getClient(): Client
    {
        if ($this->_client) {
            return $this->_client;
        }

        return $this->_client = Craft::createGuzzleClient(array_merge([
            'base_uri' => $this->getBaseUrl(),
        ], ProviderUrl::requestOptions($this->getBaseUrl())));
    }


    // Protected Methods
    // =========================================================================

    protected function getCanonicalMetricMap(): array
    {
        return [
            'visitors' => 'visitors',
            'pageviews' => 'pageviews',
            'sessions' => 'visits',
            'bounce_rate' => 'bounce_rate',
            'avg_duration' => 'avg_duration',
        ];
    }

    protected function getCanonicalDimensionMap(): array
    {
        return [
            'page' => 'path',
            'entry_page' => 'entry',
            'source' => 'channel',
            'referrer' => 'referrer',
            'country' => 'country',
            'region' => 'region',
            'device' => 'device',
            'browser' => 'browser',
            'os' => 'os',
        ];
    }


    // Private Methods
    // =========================================================================

    private function _fetchCounterData(WidgetDataInterface $widgetData): array
    {
        [$startAt, $endAt] = $this->_getTimestampRange($widgetData);

        $response = $this->request('GET', 'api/websites/' . $this->getWebsiteId() . '/stats', [
            'query' => [
                'startAt' => $startAt,
                'endAt' => $endAt,
            ],
        ]);

        $value = $this->_extractMetricValue($response, $widgetData->metric);

        return ['total' => $value];
    }

    private function _fetchPlotData(WidgetDataInterface $widgetData): array
    {
        [$startAt, $endAt] = $this->_getTimestampRange($widgetData);

        $response = $this->request('GET', 'api/websites/' . $this->getWebsiteId() . '/pageviews', [
            'query' => [
                'startAt' => $startAt,
                'endAt' => $endAt,
                'unit' => $this->_getUnit($widgetData),
                'timezone' => Craft::$app->getTimeZone(),
            ],
        ]);

        $seriesKey = match ($widgetData->metric) {
            'pageviews' => 'pageviews',
            'visitors', 'visits' => 'sessions',
            default => 'pageviews',
        };

        $data = [];

        foreach ($response[$seriesKey] ?? [] as $point) {
            $timestamp = $point['x'] ?? null;

            if (!$timestamp) {
                continue;
            }

            $key = $this->_normalizeTimestampKey($timestamp, $widgetData);
            $data[$key] = $point['y'] ?? 0;
        }

        return $data;
    }

    private function _fetchDimensionData(WidgetDataInterface $widgetData): array
    {
        [$startAt, $endAt] = $this->_getTimestampRange($widgetData);

        $response = $this->request('GET', 'api/websites/' . $this->getWebsiteId() . '/metrics/expanded', [
            'query' => [
                'startAt' => $startAt,
                'endAt' => $endAt,
                'type' => $widgetData->dimension,
                'limit' => 500,
            ],
        ]);

        $data = [];

        foreach ($response as $row) {
            $name = $row['name'] ?? null;

            if ($name === null) {
                continue;
            }

            $data[$name] = $this->_extractMetricValue($row, $widgetData->metric);
        }

        return $data;
    }

    private function _getBearerToken(): string
    {
        if ($apiKey = $this->getApiKey()) {
            return $apiKey;
        }

        $cachedToken = $this->getSettingCache('authToken');
        $cachedExpiry = (int)($this->getSettingCache('authTokenExpires') ?? 0);

        if ($cachedToken && $cachedExpiry > time() + 60) {
            return $cachedToken;
        }

        $payload = parent::request('POST', 'api/auth/login', [
            'headers' => ['Accept' => 'application/json'],
            'json' => [
                'username' => $this->getUsername(),
                'password' => $this->getPassword(),
            ],
        ]);

        $token = $payload['token'] ?? null;

        if (!$token) {
            throw new Exception(Craft::t('metrix', 'Unable to authenticate with Umami.'));
        }

        // Self-hosted JWTs vary; cache for one hour and refresh on 401 during requests.
        $this->setSettingCache([
            'authToken' => $token,
            'authTokenExpires' => time() + 3600,
        ]);

        return $token;
    }

    private function _getTimestampRange(?WidgetDataInterface $widgetData): array
    {
        if ($widgetData) {
            $dateRange = $widgetData->period::getCurrentDateRange();

            if (!$dateRange) {
                $history = $this->request('GET', 'api/websites/' . $this->getWebsiteId() . '/daterange');
                $dateRange = [
                    'start' => new \DateTime($history['startDate'] ?? 'now'),
                    'end' => new \DateTime(),
                ];
            }
        } else {
            $dateRange = [
                'start' => new \DateTime('-7 days'),
                'end' => new \DateTime(),
            ];
        }

        return [
            $dateRange['start']->getTimestamp() * 1000,
            $dateRange['end']->getTimestamp() * 1000,
        ];
    }

    private function _getUnit(WidgetDataInterface $widgetData): string
    {
        return match ($widgetData->period::getIntervalDimension()) {
            Period::INTERVAL_HOUR => 'hour',
            Period::INTERVAL_MONTH, Period::INTERVAL_YEAR => 'month',
            default => 'day',
        };
    }

    private function _normalizeTimestampKey(string $timestamp, WidgetDataInterface $widgetData): string
    {
        $date = new \DateTime($timestamp);
        $date->setTimezone(new \DateTimeZone(Craft::$app->getTimeZone()));

        return match ($widgetData->period::getIntervalDimension()) {
            Period::INTERVAL_HOUR => $date->format('Y-m-d H:00:00'),
            Period::INTERVAL_MONTH => $date->format('Y-m-01'),
            Period::INTERVAL_YEAR => $date->format('Y-01-01'),
            default => $date->format('Y-m-d'),
        };
    }

    private function _extractMetricValue(array $response, string $metric): float|int
    {
        return match ($metric) {
            'bounce_rate' => $this->_calculateBounceRate($response),
            'avg_duration' => $this->_calculateAverageDuration($response),
            default => (float)($response[$metric] ?? 0),
        };
    }

    private function _calculateBounceRate(array $response): float
    {
        $visits = (float)($response['visits'] ?? 0);
        $bounces = (float)($response['bounces'] ?? 0);

        if (!$visits) {
            return 0.0;
        }

        return round(($bounces / $visits) * 100, 2);
    }

    private function _calculateAverageDuration(array $response): float
    {
        $visits = (float)($response['visits'] ?? 0);
        $totalTime = (float)($response['totaltime'] ?? 0);

        if (!$visits) {
            return 0.0;
        }

        return round($totalTime / $visits);
    }
}
