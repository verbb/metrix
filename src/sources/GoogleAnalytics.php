<?php
namespace verbb\metrix\sources;

use verbb\metrix\Metrix;
use verbb\metrix\base\OAuthSource;
use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetDataInterface;

use Craft;
use craft\helpers\App;

use DateTime;
use Throwable;

use verbb\auth\helpers\Provider as ProviderHelper;
use verbb\auth\providers\Google as GoogleProvider;

class GoogleAnalytics extends OAuthSource
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Google Analytics');
    }

    public static function getOAuthProviderClass(): string
    {
        return GoogleProvider::class;
    }


    // Properties
    // =========================================================================

    public static string $providerHandle = 'googleAnalytics';

    public ?string $proxyRedirect = null;
    public ?string $accountId = null;
    public ?string $propertyId = null;


    // Public Methods
    // =========================================================================

    public function defineRules(): array
    {
        $rules = parent::defineRules();

        $rules[] = [['accountId', 'propertyId'], 'required', 'when' => fn($model) => $model->enabled && $model->isConnected()];

        return $rules;
    }

    public function getPrimaryColor(): ?string
    {
        return ProviderHelper::getPrimaryColor('google');
    }

    public function getIcon(): ?string
    {
        return ProviderHelper::getIcon('google');
    }

    public function getAccountId(): ?string
    {
        return App::parseEnv($this->accountId);
    }

    public function getPropertyId(): ?string
    {
        return App::parseEnv($this->propertyId);
    }

    public function getProxyRedirect(): ?bool
    {
        return App::parseBooleanEnv($this->proxyRedirect);
    }

    public function getRedirectUri(): ?string
    {
        $uri = parent::getRedirectUri();

        // Allow a proxy to our server to forward on the request - just for local dev ease
        if ($this->getProxyRedirect()) {
            return "https://proxy.verbb.io?return=$uri";
        }

        return $uri;
    }

    public function getDefaultScopes(): array
    {
        return [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/analytics',
            'https://www.googleapis.com/auth/analytics.edit',
        ];
    }

    public function getAuthorizationUrlOptions(): array
    {
        $options = parent::getAuthorizationUrlOptions();
        $options['access_type'] = 'offline';
        $options['prompt'] = 'consent';
        
        return $options;
    }

    public function fetchSourceSettings(string $settingsKey): ?array
    {
        try {
            if ($settingsKey === 'accountId') {
                $options = [];

                $response = $this->request('GET', 'https://analyticsadmin.googleapis.com/v1beta/accounts');
                $accounts = $response['accounts'] ?? [];

                foreach ($accounts as $account) {
                    $options[] = [
                        'label' => $account['displayName'],
                        'value' => $account['name'],
                    ];
                }

                // Sort the options alphabetically by label
                usort($options, function ($a, $b) {
                    return strcmp($a['label'], $b['label']);
                });

                return $options;
            }

            if ($settingsKey === 'propertyId') {
                $options = [];

                $response = $this->request('GET', 'https://analyticsadmin.googleapis.com/v1beta/properties', [
                    'query' => [
                        'filter' => 'parent:' . $this->getAccountId(),
                    ],
                ]);

                $properties = $response['properties'] ?? [];

                foreach ($properties as $property) {
                    $options[] = [
                        'label' => $property['displayName'],
                        'value' => $property['name'],
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
        $data = $this->_getPropertyMetadata();

        return array_map(fn($metric) => [
            'label' => $metric['uiName'],
            'value' => $metric['apiName']
        ], $data['metrics'] ?? []);
    }

    public function fetchAvailableDimensions(): array
    {
        $data = $this->_getPropertyMetadata();

        return array_map(fn($dimension) => [
            'label' => $dimension['uiName'],
            'value' => $dimension['apiName']
        ], $data['dimensions'] ?? []);
    }

    public function fetchData(WidgetDataInterface $widgetData): array
    {
        $intervalDimension = $this->_getIntervalDimension($widgetData);
        $dateRange = $widgetData->period::getCurrentDateRange();

        // Check for "All Time" and set a wide date range
        if ($widgetData->period === 'verbb\\metrix\\periods\\AllTime') {
            $startDate = $this->_getPropertyCreationDate();
            $endDate = (new DateTime())->format('Y-m-d');
        } else {
            $dateRange = $widgetData->period::getCurrentDateRange();
            $startDate = $dateRange['start']->format('Y-m-d');
            $endDate = $dateRange['end']->format('Y-m-d');
        }

        $payload = [
            'metrics' => [['name' => $widgetData->metric]],
            'dateRanges' => [[
                'startDate' => $startDate,
                'endDate' => $endDate,
            ]],
        ];

        if ($widgetData->widget::supportsDimensions() && $widgetData->dimension) {
            $payload['dimensions'] = [['name' => $widgetData->dimension]];
        } else {
            $payload['dimensions'] = [['name' => $intervalDimension]];
        }

        $response = $this->request('POST', 'https://analyticsdata.googleapis.com/v1beta/' . $this->getPropertyId() . ':runReport', [
            'json' => $payload,
        ]);

        $results = $response['rows'] ?? [];
        $data = [];

        foreach ($results as $result) {
            $metric = $result['metricValues'][0]['value'] ?? null;
            $dimension = $this->_formatDimension($widgetData, $result['dimensionValues'][0]['value'] ?? null);

            if ($dimension) {
                $data[$dimension] = $metric;
            }
        }

        return $data;
    }

    public function fetchRealtimeData(WidgetDataInterface $widgetData): array
    {
        $payload = [
            'metrics' => [['name' => 'activeUsers']],
            'limit' => 100,
        ];

        $response = $this->request('POST', 'https://analyticsdata.googleapis.com/v1beta/' . $this->getPropertyId() . ':runRealtimeReport', [
            'json' => $payload,
        ]);

        $results = $response['rows'] ?? [];

        return [
            Craft::t('metrix', 'Active users') => $results[0]['metricValues'][0]['value'] ?? null,
        ];
    }


    // Private Methods
    // =========================================================================

    private function _getPropertyMetadata(): array
    {
        $cacheKey = 'metrix.googleAnalytics.metadata.' . $this->getPropertyId();

        // Cache for 24 hours
        return Craft::$app->getCache()->getOrSet($cacheKey, function() {
            try {
                $response = $this->request('GET', 'https://analyticsdata.googleapis.com/v1beta/' . $this->getPropertyId() . '/metadata');

                return $response;
            } catch (Throwable $e) {
                self::apiError($this, $e);

                return null; // In case of error, don't cache anything
            }
        }, 24 * 3600) ?? [];
    }

    private function _getPropertyCreationDate(): string
    {
        $defaultStartDate = '2005-01-01'; // Google Analytics earliest possible start date

        try {
            $response = $this->request('GET', 'https://analyticsadmin.googleapis.com/v1beta/' . $this->getPropertyId());

            return $response['createTime'] ? (new DateTime($response['createTime']))->format('Y-m-d') : $defaultStartDate;
        } catch (Throwable $e) {
        }

        return $defaultStartDate;
    }

    private function _getIntervalDimension(WidgetDataInterface $widgetData): string
    {
        $intervalDimension = $widgetData->period::getIntervalDimension();

        if ($intervalDimension === Period::INTERVAL_HOUR) {
            return 'dateHour';
        }

        if ($intervalDimension === Period::INTERVAL_DAY) {
            return 'date';
        }

        if ($intervalDimension === Period::INTERVAL_MONTH) {
            return 'yearMonth';
        }

        return 'date';
    }

    private function _formatDimension(WidgetDataInterface $widgetData, ?string $dimension): string
    {
        if ($dimension === null) {
            return '';
        }

        // For plot data, ensure we format the date correctly
        $intervalDimension = $widgetData->period::getIntervalDimension();

        if (!$widgetData->widget::supportsDimensions() || empty($widgetData->dimension)) {
            if ($intervalDimension === Period::INTERVAL_HOUR) {
                // dimension is in YYYYMMDDHH format -> return YYYY-MM-DD HH:MM:SS
                return substr($dimension, 0, 4) . '-' . substr($dimension, 4, 2) . '-' . substr($dimension, 6, 2) . ' ' . substr($dimension, 8, 2) . ':00:00';
            }

            if ($intervalDimension === Period::INTERVAL_DAY) {
                // dimension is in YYYYMMDD format -> return YYYY-MM-DD
                return substr($dimension, 0, 4) . '-' . substr($dimension, 4, 2) . '-' . substr($dimension, 6, 2);
            }

            if ($intervalDimension === Period::INTERVAL_MONTH) {
                // dimension is in YYYYMM format -> return YYYY-MM-DD
                return substr($dimension, 0, 4) . '-' . substr($dimension, 4, 2) . '-01';
            }
        }

        return $dimension;
    }
}
