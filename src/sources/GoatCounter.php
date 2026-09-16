<?php
namespace verbb\metrix\sources;

use verbb\metrix\base\CredentialsSource;
use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetDataInterface;
use verbb\metrix\widgets\data\PlotData;

use Craft;
use craft\helpers\App;

use DateTime;
use Exception;
use Throwable;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

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

        if (is_a($widgetData->widget::getDataType(), PlotData::class, true)) {
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

    public function request(string $method, string $url, array $options = []): mixed
    {
        try {
            return parent::request($method, $url, $options);
        } catch (ClientException $e) {
            $response = $e->getResponse();
            $reset = $response->getHeaderLine('X-Rate-Limit-Reset');
            $delay = is_numeric($reset) ? max(0, (int)ceil((float)$reset)) : 1;

            if ($response->getStatusCode() !== 429 || $delay > 10) {
                throw $e;
            }

            // A large report may exceed the provider's four requests per second.
            sleep($delay);

            return parent::request($method, $url, $options);
        }
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
                'Content-Type' => 'application/json',
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

            $date = new DateTime($day);

            switch ($widgetData->period::getIntervalDimension()) {
                case Period::INTERVAL_HOUR:
                    foreach ($row['hourly'] ?? [] as $hour => $value) {
                        $data[$date->format('Y-m-d') . sprintf(' %02d:00:00', $hour)] = $value;
                    }
                    break;
                case Period::INTERVAL_MONTH:
                    if (isset($row['monthly'])) {
                        $data[$date->format('Y-m-01')] = $row['monthly'];
                    }
                    break;
                default:
                    $data[$date->format('Y-m-d')] = $row['daily'] ?? 0;
            }
        }

        return $data;
    }

    private function _fetchDimensionData(WidgetDataInterface $widgetData): array
    {
        $pages = $widgetData->dimension === 'pages';
        $endpoint = $pages ? 'hits' : $widgetData->dimension;
        $dateQuery = $this->_getDateQuery($widgetData);
        $limit = $widgetData->getRowLimit();
        $offset = 0;
        $excludedPaths = [];
        $data = [];

        do {
            $query = array_merge($dateQuery, ['limit' => min(100, $limit - $offset)]);

            if ($pages && $excludedPaths) {
                $query['exclude_paths'] = implode(',', $excludedPaths);
            } elseif (!$pages) {
                $query['offset'] = $offset;
            }

            $response = $this->request('GET', 'api/v0/stats/' . $endpoint, ['query' => $query]);
            $rows = $response[$pages ? 'hits' : 'stats'] ?? [];

            foreach ($rows as $row) {
                $label = $row[$pages ? 'path' : 'name'] ?? null;

                if ($label !== null) {
                    $data[$label] = $row['count'] ?? 0;
                }

                if ($pages && isset($row['path_id'])) {
                    $excludedPaths[] = $row['path_id'];
                }
            }

            $offset += count($rows);
        } while ($rows && ($response['more'] ?? false) && $offset < $limit);

        return $data;
    }

    private function _getDateQuery(WidgetDataInterface $widgetData): array
    {
        $dateRange = $widgetData->period::getCurrentDateRange();

        if (!$dateRange) {
            // The current site precedes its child sites in the API response.
            $response = $this->request('GET', 'api/v0/sites');
            $site = $response['sites'][0] ?? [];
            $start = $site['first_hit_at'] ?? $site['created_at'] ?? null;

            if (!$start) {
                throw new Exception(Craft::t('metrix', 'Unable to determine the GoatCounter site’s reporting start date.'));
            }

            $dateRange = ['start' => (new DateTime($start))->setTime(0, 0), 'end' => new DateTime()];
        }

        return [
            'start' => $dateRange['start']->format(DATE_ATOM),
            'end' => $dateRange['end']->format(DATE_ATOM),
        ];
    }
}
