<?php
namespace verbb\metrix\sources;

use verbb\metrix\Metrix;
use verbb\metrix\base\OAuthSource;
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

        $rules[] = [
            ['accountId', 'propertyId'], 'required', 'when' => function($model) {
                return $model->enabled && $model->isConnected();
            },
        ];


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
                        'filter' => 'parent:' . $this->accountId,
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
        $dateRange = $widgetData->period::getCurrentDateRange();
        $intervalDimension = $widgetData->period::getIntervalDimension();

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

        $response = $this->request('POST', 'https://analyticsdata.googleapis.com/v1beta/' . $this->propertyId . ':runReport', [
            'json' => $payload,
        ]);

        $rawData = $response['rows'] ?? [];

        return array_map(fn($row) => [
            'metric' => $row['metricValues'][0]['value'] ?? 0,
            'dimension' => $row['dimensionValues'][0]['value'] ?? null,
        ], $rawData);
    }


    // Private Methods
    // =========================================================================

    private function _getPropertyMetadata(): array
    {
        $cacheKey = 'metrix.googleAnalytics.metadata.' . $this->propertyId;

        // Cache for 24 hours
        return Craft::$app->getCache()->getOrSet($cacheKey, function() {
            try {
                $response = $this->request('GET', 'https://analyticsdata.googleapis.com/v1beta/' . $this->propertyId . '/metadata');

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
            $response = $this->request('GET', 'https://analyticsadmin.googleapis.com/v1beta/' . $this->propertyId);

            return $response['createTime'] ? (new DateTime($response['createTime']))->format('Y-m-d') : $defaultStartDate;
        } catch (Throwable $e) {
        }

        return $defaultStartDate;
    }
}
