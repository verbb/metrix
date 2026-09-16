# Custom Source
Register a custom Source when Metrix does not include the analytics provider your project needs. Build the class in a project module or plugin, register it during module initialisation, and test connection, historical data and every capability you advertise.

```php
namespace modules\sitemodule;

use craft\events\RegisterComponentTypesEvent;
use modules\sitemodule\MySourceProvider;
use verbb\metrix\services\Sources;
use yii\base\Event;

Event::on(Sources::class, Sources::EVENT_REGISTER_SOURCE_TYPES, function(RegisterComponentTypesEvent $event) {
    $event->types[] = MySourceProvider::class;
});
```

## OAuth Example
If your provider requires OAuth authentication, create the following class to house your Source Provider logic.

```php
namespace modules\sitemodule;

use Craft;
use verbb\metrix\base\OAuthSource;
use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetDataInterface;

use League\OAuth2\Client\Provider\SomeProvider;

class MySourceProvider extends OAuthSource
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return 'My Source Provider';
    }

    public static function getOAuthProviderClass(): string
    {
        return SomeProvider::class;
    }


    // Properties
    // =========================================================================

    public static string $providerHandle = 'mySourceProvider';


    // Public Methods
    // =========================================================================

    public function getPrimaryColor(): ?string
    {
        return '#000000';
    }

    public function getIcon(): ?string
    {
        return null;
    }

    public function getSettingsHtml(): ?string
    {
        return Craft::$app->getView()->renderTemplate('my-module/my-source/settings', [
            'source' => $this,
        ]);
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
        $dateRange = $widgetData->period::getCurrentDateRange();

        $response = $this->request('POST', 'data', [
            'json' => [
                'metric' => $widgetData->metric,
                'dimension' => $widgetData->dimension,
                'date_grouping' => $this->_getIntervalDimension($widgetData),
                'start_date' => $dateRange['start']->format('Y-m-d'),
                'end_date' => $dateRange['end']->format('Y-m-d'),
            ],
        ]);

        $data = [];

        foreach ($response as $result) {
            $data[$result['date']] = $result[$widgetData->metric];
        }

        return $data;
    }


    // Private Methods
    // =========================================================================

    private function _getIntervalDimension(WidgetDataInterface $widgetData): string
    {
        $intervalDimension = $widgetData->period::getIntervalDimension();

        if ($intervalDimension === Period::INTERVAL_HOUR) {
            return 'hour';
        }

        if ($intervalDimension === Period::INTERVAL_MONTH) {
            return 'month';
        }

        return 'day';
    }
}
```

Replace `SomeProvider` with the `AbstractProvider` implementation supplied by your installed OAuth client package. Create `modules/sitemodule/templates/my-source/settings.twig` for the Source-specific settings returned by `getSettingsHtml()`. The example illustrates the Metrix hooks but is not a drop-in provider: map your API's response shape, authentication scopes, error responses and pagination before registering it in production.

Metrix OAuth source providers use [Auth](https://github.com/verbb/auth), which is built on [league/oauth2-client](https://github.com/thephpleague/oauth2-client). `getOAuthProviderClass()` must return a `League\OAuth2\Client\Provider\AbstractProvider` class supplied by an installed provider package.


## Credentials Example
If your provider requires non-OAuth authentication, like API keys or tokens, create the following class to house your Source Provider logic.

```php
namespace modules\sitemodule;

use Craft;
use verbb\metrix\base\CredentialsSource;
use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetDataInterface;

use craft\helpers\App;

use Throwable;

use GuzzleHttp\Client;

class MySourceProvider extends CredentialsSource
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return 'My Source Provider';
    }


    // Properties
    // =========================================================================

    public static string $providerHandle = 'mySourceProvider';


    // Public Methods
    // =========================================================================

    public function getPrimaryColor(): ?string
    {
        return '#000000';
    }

    public function getIcon(): ?string
    {
        return null;
    }

    public function getSettingsHtml(): ?string
    {
        return Craft::$app->getView()->renderTemplate('my-module/my-source/settings', [
            'source' => $this,
        ]);
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
        $dateRange = $widgetData->period::getCurrentDateRange();

        $response = $this->request('POST', 'data', [
            'json' => [
                'metric' => $widgetData->metric,
                'dimension' => $widgetData->dimension,
                'date_grouping' => $this->_getIntervalDimension($widgetData),
                'start_date' => $dateRange['start']->format('Y-m-d'),
                'end_date' => $dateRange['end']->format('Y-m-d'),
            ],
        ]);

        $data = [];

        foreach ($response as $result) {
            $data[$result['date']] = $result[$widgetData->metric];
        }

        return $data;
    }

    public function fetchConnection(): bool
    {
        try {
            $this->request('GET', 'me');
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
            'base_uri' => 'https://api.my-provider.com/v1/',
            'headers' => [
                'Authorization' => 'Bearer ' . App::env('METRIX_PROVIDER_TOKEN'),
            ],
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

        if ($intervalDimension === Period::INTERVAL_MONTH) {
            return 'month';
        }

        return 'day';
    }
}
```

Unlike an OAuth Source, a Credentials Source defines its own HTTP client and calls `$this->request()` for provider requests. Set `METRIX_PROVIDER_TOKEN` in the environment before testing the example. For a reusable provider, expose the credential as a Source setting that accepts an environment-variable reference rather than fixing the variable name in the class.

Implement `fetchConnection()` so Metrix can validate the saved credentials. Before shipping the Source, add failure tests for invalid credentials, rate limits and empty datasets, then create a widget for every supported metric and dimension.
