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

class Cloudflare extends CredentialsSource
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Cloudflare');
    }


    // Properties
    // =========================================================================

    public static string $providerHandle = 'cloudflare';

    public ?string $apiToken = null;
    public ?string $zoneId = null;


    // Public Methods
    // =========================================================================

    public function defineRules(): array
    {
        $rules = parent::defineRules();

        $rules[] = [['apiToken', 'zoneId'], 'required', 'when' => fn($model) => $model->enabled];

        return $rules;
    }

    public function getPrimaryColor(): ?string
    {
        return '#F38020';
    }

    public function getIcon(): ?string
    {
        return '<svg viewBox="0 0 749.75 339.1"><path fill="currentColor" d="m601.9,147.07c-.37,0-.8-.03-1.22-.03-2.17,0-4.35.13-6.45.4l.25-.03c-1.85.1-3.4,1.35-3.95,3.03v.03l-10.55,36.7c-1.7,4.68-2.7,10.05-2.7,15.68,0,9.45,2.8,18.28,7.63,25.65l-.1-.17c7.73,9.92,19.65,16.23,33.07,16.23h.12l57.6,3.55h.1c1.67,0,3.18.87,4.02,2.17v.02c.55.93.87,2.05.87,3.22,0,.58-.08,1.15-.23,1.7v-.05c-1,2.68-3.45,4.6-6.35,4.85h-.02l-60.02,3.5c-36.18,3.98-66.1,27.23-79.5,59.15l-.25.65-4.4,11.2c-.15.37-.25.8-.25,1.25,0,1.75,1.42,3.18,3.18,3.18h206.3c2.48,0,4.55-1.65,5.2-3.9v-.05c3.45-11.98,5.45-25.75,5.5-39.98v-.02c-.23-81.55-66.32-147.57-147.9-147.67h0l.05-.25Zm-86.12,173.8c1.7-4.65,2.68-10.02,2.68-15.62,0-9.47-2.8-18.28-7.65-25.65l.1.17c-7.7-9.92-19.62-16.25-33.05-16.25h-.12l-270.53-3.5h-.08c-1.7,0-3.2-.87-4.08-2.2v-.02c-.55-.9-.9-2-.9-3.18,0-.6.08-1.18.25-1.73v.05c1-2.68,3.43-4.6,6.33-4.87h.03l272.92-3.5c36.18-4,66.07-27.25,79.55-59.15l.25-.65,15.6-40.65c.43-.97.68-2.13.68-3.33,0-.68-.08-1.35-.23-1.98v.05C559.15,58.8,488.5,0,404.12,0c-77.73,0-143.77,49.9-167.93,119.4l-.38,1.25c-13.2-9.98-29.87-16-47.97-16-41.28,0-75.25,31.3-79.47,71.48l-.02.35c-.25,2.43-.4,5.25-.4,8.1,0,7.03.87,13.88,2.5,20.4l-.13-.58C49.03,206.17,0,256.3,0,317.87v.15h0c.05,5.85.45,11.57,1.18,17.18l-.08-.7c.42,2.6,2.6,4.55,5.27,4.6h499.28c3-.08,5.5-2.08,6.33-4.8v-.05l3.75-13.32.05-.05Z"/></svg>';
    }

    public function getApiToken(): ?string
    {
        return App::parseEnv($this->apiToken);
    }

    public function getZoneId(): ?string
    {
        return App::parseEnv($this->zoneId);
    }

    public function fetchSourceSettings(string $settingsKey): ?array
    {
        try {
            if ($settingsKey === 'zoneId') {
                $options = [];

                $response = $this->request('GET', 'zones', [
                    'query' => [
                        'per_page' => 500,
                    ],
                ]);
                $zones = $response['result'] ?? [];

                foreach ($zones as $zone) {
                    $options[] = [
                        'label' => $zone['name'],
                        'value' => $zone['id'],
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
        return [
            ['label' => Craft::t('metrix', 'Requests'), 'value' => 'requests'],
            ['label' => Craft::t('metrix', 'Page Views'), 'value' => 'pageViews'],
            ['label' => Craft::t('metrix', 'Bandwidth'), 'value' => 'bandwidth'],
            ['label' => Craft::t('metrix', 'Threats'), 'value' => 'threats'],
        ];
    }

    public function fetchAvailableDimensions(): array
    {
        return [
            ['label' => Craft::t('metrix', 'Country'), 'value' => 'country'],
            ['label' => Craft::t('metrix', 'Browser'), 'value' => 'browser'],
        ];
    }

    public function fetchData(WidgetDataInterface $widgetData): array
    {
        $intervalDimension = $this->_getIntervalDimension($widgetData);
        $dateRange = $widgetData->period::getCurrentDateRange();
        $startDate = $dateRange['start']->format('Y-m-d');
        $endDate = $dateRange['end']->format('Y-m-d');

        $dimensionPart = $widgetData->dimension ? $widgetData->dimension : 'date';

        $query = <<<GRAPHQL
        query {
            viewer {
                zones(filter: {zoneTag: "{$this->getZoneId()}"}) {
                    {$intervalDimension}(limit: 1000, filter: {date_geq: "{$startDate}", date_leq: "{$endDate}"}) {
                        dimensions {
                            $dimensionPart
                        }

                        sum {
                            $widgetData->metric
                        }
                    }
                }
            }
        }
        GRAPHQL;

        $response = $this->request('POST', 'graphql', [
            'json' => [
                'query' => $query,
            ],
        ]);

        $groups = $response['data']['viewer']['zones'][0][$intervalDimension] ?? [];

        $data = [];

        foreach ($groups as $group) {
            $dimension = $group['dimensions'][$dimensionPart];
            $metricValue = $group['sum'][$widgetData->metric] ?? 0;

            $data[$dimension] = $metricValue;
        }

        return $data;
    }

    public function fetchConnection(): bool
    {
        try {
            $this->request('GET', 'user/tokens/verify');
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
            'base_uri' => 'https://api.cloudflare.com/client/v4/',
            'headers' => ['Authorization' => 'Bearer ' . $this->getApiToken()],
        ]);
    }


    // Private Methods
    // =========================================================================

    private function _getIntervalDimension(WidgetDataInterface $widgetData): string
    {
        $intervalDimension = $widgetData->period::getIntervalDimension();

        if ($intervalDimension === Period::INTERVAL_HOUR) {
            return 'httpRequests1hGroups';
        }

        if ($intervalDimension === Period::INTERVAL_DAY) {
            return 'httpRequests1dGroups';
        }

        if ($intervalDimension === Period::INTERVAL_MONTH) {
            return 'httpRequests1mGroups';
        }

        return 'httpRequests1dGroups';
    }
}