# Custom Source
You can register your own Source Provider to add support for other analytics platforms, or even extend an existing Source Provider.

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
use Throwable;
use verbb\metrix\Metrix;
use verbb\metrix\base\OAuthSource;
use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetDataInterface;

use DateTime;

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
        return '<svg>...</svg>';
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

This is the minimum amount of implementation required for a typical source provider.

Metrix OAuth source providers are built around the [Auth](https://github.com/verbb/auth) which in turn is built around [league/oauth2-client](https://github.com/thephpleague/oauth2-client). You can see that the `getOAuthProviderClass()` must return a `League\OAuth2\Client\Provider\AbstractProvider` class.


## Credentials Example
If your provider requires non-OAuth authentication, like API keys or tokens, create the following class to house your Source Provider logic.

```php
namespace modules\sitemodule;

use Craft;
use Throwable;
use verbb\metrix\Metrix;
use verbb\metrix\base\CredentialsSource;
use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetDataInterface;

use DateTime;
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
        return '<svg>...</svg>';
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
            'headers' => ['Authorization' => 'Bearer xxxxxxxxxxxxxxxxx'],
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

The major different between the two is that you're no longer relying on the [Auth](https://github.com/verbb/auth) package to handle requests (as you don't need to). Instead, you'll need to define a Guzzle client and call `$this->request()` to make HTTP requests for your source provider.

You should also provide a `fetchConnection()` function that serves as a way to test the connection to the provider. This allows Metrix to confirm that you've set everything up correctly.
