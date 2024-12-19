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
        return '#846bff';
    }

    public function getIcon(): ?string
    {
        return '<svg viewBox="0 0 209.48 180.63"><path fill="currentColor" d="m184.42,0h20.88c2.3,0,4.17,1.85,4.18,4.15,0,.37-.05.74-.14,1.1l-46.3,172.25c-.48,1.83-2.13,3.12-4.02,3.12h-20.9c-2.3,0-4.17-1.85-4.18-4.15,0-.37.05-.74.14-1.1l2.81-10.47,2.05-7.62L180.36,3.09c.49-1.81,2.14-3.08,4.02-3.08h.05ZM31.35,13.47h8.4c2.3,0,4.16,1.86,4.16,4.16v14.06c0,2.3-1.86,4.16-4.16,4.16h-7.13c-1.44-.05-2.88.02-4.3.19-.73.06-1.43.33-2,.78-.36.37-.63.81-.78,1.3-.55,1.69-.8,3.47-.72,5.25v10.68h14.97c2.3,0,4.16,1.86,4.16,4.16v14.06c0,2.3-1.87,4.16-4.16,4.16h-15.01v84.93c0,2.3-1.87,4.17-4.17,4.17H4.17C1.87,165.55,0,163.68,0,161.38H0V40.88c-.09-4.49.87-8.95,2.81-13,1.76-3.5,4.37-6.5,7.6-8.72,6.17-4.28,13.77-5.68,20.95-5.71l-.02.02Zm64.17,39.06c12.79,0,23.65,3.63,31.38,10.37s12.09,16.57,12.05,27.8v28.05l-12.59,46.81h-8c-2.3,0-4.16-1.86-4.16-4.16h0v-3.13c-1.17,1.02-2.41,1.95-3.72,2.78-5.58,3.55-13.16,5.87-23.16,5.87-7.7.17-15.34-1.49-22.28-4.83-6.49-3.21-11.69-8.54-14.72-15.12-2.13-4.8-3.19-10.01-3.12-15.27-.16-5.77,1.25-11.47,4.09-16.5,2.62-4.32,6.33-7.87,10.77-10.3,8.66-4.88,19.34-6.6,29.8-8,5.7-.78,10.27-1.26,13.78-1.72,2.44-.22,4.85-.71,7.19-1.47.41-.12.79-.36,1.09-.67l.19-.37c.11-.47.15-.95.12-1.44v-.57c.15-4.05-1.53-7.95-4.57-10.63-2.97-2.59-7.63-4.34-14.12-4.35s-11.44,1.77-14.84,4.37c-3.2,2.3-5.25,5.87-5.63,9.8-.19,2.15-1.99,3.8-4.15,3.8h-17.38c-2.3,0-4.17-1.86-4.17-4.16,0-.06,0-.13,0-.19.47-10.44,5.5-20.15,13.75-26.56,8.18-6.52,19.41-10.25,32.41-10.25v.04Zm18.69,63.05c-1.5.37-3.12.78-4.93,1.13-5.05,1-11.16,1.88-17.09,2.72-3.95.47-7.82,1.42-11.53,2.85-3.27,1.37-5.55,3.12-6.78,5.13-.92,1.54-1.38,3.31-1.34,5.11v.16c-.02,1.59.33,3.16,1.03,4.59.7,1.32,1.71,2.45,2.94,3.3,2.66,1.91,7.13,3.23,13.16,3.23,9.34,0,15.25-2.73,19-6.5s5.47-9.03,5.53-14.93v-6.79Z"/></svg>';
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