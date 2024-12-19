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

class Matomo extends CredentialsSource
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Matomo');
    }


    // Properties
    // =========================================================================

    public static string $providerHandle = 'matomo';

    public ?string $apiUrl = null;
    public ?string $apiToken = null;
    public ?string $siteId = null;


    // Public Methods
    // =========================================================================

    public function defineRules(): array
    {
        $rules = parent::defineRules();

        $rules[] = [['apiUrl', 'apiToken', 'siteId'], 'required', 'when' => fn($model) => $model->enabled];

        return $rules;
    }

    public function getPrimaryColor(): ?string
    {
        return '#4b77be';
    }

    public function getIcon(): ?string
    {
        return '<svg viewBox="0 0 457.66 258.67"><path fill="currentColor" d="m314.92,195.39l56.17-87.5-.23-.16.23.16c8.05-11.95,12.66-26.33,12.66-41.72,0-2.11-.08-4.14-.23-6.17l62.66,95.47c.23.31.31.55.55.86l1.17,1.8-.08.08c6.17,10.08,9.77,21.88,9.84,34.45,0,36.41-29.53,65.94-65.94,65.94-22.34,0-41.95-11.09-53.91-28.05l-.08.08-.39-.62c-.31-.47-.62-1.02-1.02-1.48m-26.64-41.25l35.94-56.02c-1.95,1.09-3.98,2.19-6.09,3.12-.16.08-.31.16-.39.16-1.95.86-3.91,1.64-5.94,2.34-.39.16-.7.23-1.09.39-.55.16-1.17.39-1.72.55-.78.23-1.64.47-2.5.7-.47.16-.94.23-1.41.39l-1.88.47-1.17.23c-.94.23-1.95.39-2.97.55-.31.08-.7.08-1.02.16-.94.16-1.8.23-2.73.31-.16,0-.39.08-.55.08l-3.28.23c-.31,0-.55,0-.86.08-1.17.08-2.27.08-3.44.08-1.25,0-2.5,0-3.75-.08-.39,0-.86-.08-1.25-.08-.78-.08-1.64-.08-2.42-.16-.47-.08-1.02-.08-1.48-.16-.7-.08-1.48-.16-2.19-.31-.55-.08-1.02-.16-1.56-.23-.7-.08-1.33-.23-2.03-.39-.55-.08-1.09-.23-1.56-.31-.62-.16-1.25-.31-1.95-.47-.55-.16-1.09-.31-1.64-.39-.62-.16-1.25-.31-1.88-.55l-1.64-.47c-.62-.16-1.17-.39-1.72-.62-.55-.16-1.09-.39-1.64-.62-.55-.23-1.09-.47-1.64-.62l-1.64-.7c-.55-.23-1.02-.47-1.56-.7-.55-.23-1.09-.55-1.64-.78-.39-.23-.86-.47-1.25-.62l-.08-.16c-.55-.31-1.09-.55-1.64-.86-.39-.23-.86-.47-1.25-.7-.62-.31-1.17-.7-1.8-1.02-.31-.16-.55-.39-.86-.55-1.64-1.02-3.2-2.11-4.69-3.2-1.64-1.25-3.28-2.58-4.84-3.91-.16-.16-.31-.23-.47-.39-.7-.62-1.33-1.25-1.95-1.87-.16-.16-.31-.31-.55-.47l-1.88-1.87c-.16-.16-.31-.39-.55-.55-.62-.62-1.17-1.33-1.8-1.95-.16-.16-.31-.39-.47-.55-.55-.7-1.17-1.41-1.72-2.11-.16-.16-.31-.31-.39-.55-.55-.7-1.09-1.48-1.64-2.19-.08-.16-.23-.31-.31-.47-.55-.78-1.09-1.56-1.64-2.42-.08-.08-.16-.23-.23-.31l-1.64-2.58-.08-.08c-5.08-8.67-8.44-18.44-9.69-28.83,0-.16,0-.31-.08-.47l-30.39-42.97h-.08C191.8,12.97,171.09.39,147.27.39h-.31c-23.75,0-44.53,12.58-56.09,31.41h-.08L29.69,127.19c10.78-6.02,23.13-9.38,36.25-9.38,38.28,0,69.92,28.83,74.37,65.86l34.3,48.12h.08c11.95,16.25,31.25,26.88,53.05,26.88h.31c21.8,0,41.02-10.55,53.05-26.88h.08l.55-.86c1.33-1.88,2.58-3.83,3.83-5.94l24.14-37.66.08.16-.08-.16v-.08h0Zm-67.11-121.25c0,36.48,29.53,66.02,66.02,66.02s66.02-29.53,66.02-66.02S345.08,0,308.59,0s-66.02,29.53-66.02,66.02ZM0,192.73c0,36.41,29.53,65.94,65.94,65.94s65.94-29.53,65.94-65.94-29.53-65.94-65.94-65.94S0,156.33,0,192.73Z"/></svg>';
    }

    public function getApiUrl(): ?string
    {
        return App::parseEnv($this->apiUrl);
    }

    public function getApiToken(): ?string
    {
        return App::parseEnv($this->apiToken);
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

                $sites = $this->request('POST', '', [
                    'form_params' => [
                        'module' => 'API',
                        'method' => 'SitesManager.getAllSites',
                        'format' => 'json',
                        'token_auth' => $this->getApiToken(),
                    ],
                ]);

                foreach ($sites as $site) {
                    $options[] = [
                        'label' => $site['name'],
                        'value' => $site['idsite'],
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
        // Hardcoded metrics based on Matomo documentation
        $metrics = [
            'nb_visits' => 'Total Visits',
            'nb_uniq_visitors' => 'Unique Visitors',
            'nb_pageviews' => 'Pageviews',
            'avg_time_on_site' => 'Average Time on Site',
            'bounce_rate' => 'Bounce Rate',
        ];

        return array_map(fn($key, $label) => [
            'label' => $label,
            'value' => $key,
        ], array_keys($metrics), $metrics);
    }

    public function fetchAvailableDimensions(): array
    {
        // Hardcoded list of dimensions based on Matomo documentation
        $dimensions = [
            'browser' => 'Browser',
            'country' => 'Country',
            'city' => 'City',
            'referrer' => 'Referrer',
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

        $params = [
            'module' => 'API',
            'method' => 'VisitsSummary.get',
            'idSite' => $this->getSiteId(),
            'period' => $intervalDimension,
            'date' => "$startDate,$endDate",
            'format' => 'json',
            'token_auth' => $this->getApiToken(),
        ];

        $response = $this->request('POST', '', ['form_params' => $params]);

        $data = [];

        foreach ($response as $key => $result) {
            $data[$key] = $result[$widgetData->metric] ?? null;
        }

        return $data;
    }

    public function fetchConnection(): bool
    {
        try {
            $response = $this->request('POST', '', [
                'form_params' => [
                    'module' => 'API',
                    'method' => 'API.getMatomoVersion',
                    'format' => 'json',
                    'token_auth' => $this->getApiToken(),
                ],
            ]);

            if (isset($response['value']) && is_string($response['value'])) {
                return true;
            }
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
            'base_uri' => rtrim($this->getApiUrl(), '/') . '/',
            'headers' => ['Authorization' => 'Bearer ' . $this->getApiToken()],
        ]);
    }


    // Private Methods
    // =========================================================================

    private function _getIntervalDimension(WidgetDataInterface $widgetData): string
    {
        $intervalDimension = $widgetData->period::getIntervalDimension();

        // Matomo doesn't support hourly intervals by default; this requires custom plugins
        if ($intervalDimension === Period::INTERVAL_HOUR) {
            return 'day';
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