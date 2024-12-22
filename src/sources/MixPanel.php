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

class MixPanel extends CredentialsSource
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'MixPanel');
    }


    // Properties
    // =========================================================================

    public static string $providerHandle = 'mixPanel';

    public ?string $username = null;
    public ?string $password = null;
    public ?string $projectId = null;


    // Public Methods
    // =========================================================================

    public function defineRules(): array
    {
        $rules = parent::defineRules();

        $rules[] = [['username', 'password', 'projectId'], 'required', 'when' => fn($model) => $model->enabled];

        return $rules;
    }

    public function getPrimaryColor(): ?string
    {
        return '#1b0b3b';
    }

    public function getIcon(): ?string
    {
        return '<svg viewBox="0 0 106.51 101.62"><path fill="currentColor" d="m30.92,41.92h13.55c-3.38-2.12-4.65-5.08-6.35-10.58l-5.08-18.84C30.71,4.02,28.8,0,19.48,0H.02v5.08h2.76c5.71,0,6.35,2.12,8.05,8.47l4.44,16.52c2.32,8.05,5.93,11.85,15.67,11.85h-.02Zm31.33,0h13.55c9.73,0,13.12-3.82,15.46-11.85l4.44-16.52c1.7-6.35,2.53-8.47,8.05-8.47h2.76V0h-19.26c-9.53,0-11.43,3.82-13.55,12.49l-5.08,18.84c-1.7,5.71-2.98,8.47-6.37,10.58Zm-17.78,17.78h17.78v-17.78h-17.78v17.78ZM.02,101.62h19.47c9.32,0,11.23-4.02,13.55-12.49l5.08-18.84c1.7-5.5,2.97-8.47,6.35-10.58h-13.55c-9.73,0-13.34,3.82-15.67,11.85l-4.44,16.52c-1.7,6.35-2.33,8.47-8.05,8.47H0v5.08h.02Zm87.2,0h19.26v-5.08h-2.76c-5.5,0-6.35-2.12-8.05-8.47l-4.44-16.52c-2.33-8.05-5.71-11.85-15.46-11.85h-13.52c3.38,2.12,4.62,4.88,6.32,10.58l5.08,18.84c2.12,8.68,4.02,12.49,13.55,12.49h.02Z"/></svg>';
    }

    public function getUsername(): ?string
    {
        return App::parseEnv($this->username);
    }

    public function getPassword(): ?string
    {
        return App::parseEnv($this->password);
    }

    public function getProjectId(): ?string
    {
        return App::parseEnv($this->projectId);
    }

    public function fetchAvailableMetrics(): array
    {
        $data = $this->_getPropertyMetadata();

        return array_map(fn($metric) => [
            'label' => $metric['event'],
            'value' => $metric['event']
        ], $data ?? []);
    }

    public function fetchData(WidgetDataInterface $widgetData): array
    {
        $intervalDimension = $this->_getIntervalDimension($widgetData);
        $dateRange = $widgetData->period::getCurrentDateRange();
        $startDate = $dateRange['start']->format('Y-m-d');
        $endDate = $dateRange['end']->format('Y-m-d');

        $params = [
            'project_id' => $this->getProjectId(),
            'from_date' => $startDate,
            'to_date' => $endDate,
            'event' => Json::encode([$widgetData->metric]),
            'type' => 'general',
            'unit' => $intervalDimension,
        ];

        $response = $this->request('GET', 'events', ['query' => $params]);

        $data = $response['data'] ?? [];
        $series = $data['series'] ?? [];
        $values = $data['values'] ?? [];

        $formattedData = [];

        foreach ($series as $index => $dimension) {
            $metric = $values[$index] ?? 0;

            $formattedData[] = [
                'dimension' => $dimension,
                'metric' => (int)$metric,
            ];
        }

        return $formattedData;
    }

    public function fetchConnection(): bool
    {
        try {
            $this->request('GET', 'https://mixpanel.com/api/app/me');
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
            'base_uri' => 'https://mixpanel.com/api/query/',
            'auth' => [$this->getUsername(), $this->getPassword()],
        ]);
    }


    // Private Methods
    // =========================================================================

    private function _getPropertyMetadata(): array
    {
        $cacheKey = 'metrix.mixPanel.metadata.' . $this->getProjectId();

        // Cache for 24 hours
        return Craft::$app->getCache()->getOrSet($cacheKey, function() {
            try {
                $response = $this->request('GET', 'events/names', [
                    'query' => [
                        'project_id' => $this->getProjectId(),
                        'type' => 'general',
                    ],
                ]);

                return $response;
            } catch (Throwable $e) {
                self::apiError($this, $e);

                return null; // In case of error, don't cache anything
            }
        }, 24 * 3600) ?? [];
    }

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