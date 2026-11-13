# Custom Sources

A Source connects Metrix to an analytics provider and fetches the numbers its widgets show. Make a custom Source when Metrix doesn't include the provider your project needs. Build the class in a module or plugin, then test the connection, historical data and every capability you advertise.

## Create the Source Class

Extend `verbb\metrix\base\OAuthSource` for a provider that uses OAuth, or `verbb\metrix\base\CredentialsSource` for one that uses API keys or tokens. Set the static `$providerHandle` property to a unique handle for the provider.

### OAuth Sources

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

### Credentials Sources

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

## Register the Source

Metrix finds sources through the `registerSourceTypes` event. Register your class from your module or plugin’s `init()` method.

```php
use craft\events\RegisterComponentTypesEvent;
use modules\sitemodule\MySourceProvider;
use verbb\metrix\services\Sources;
use yii\base\Event;

Event::on(Sources::class, Sources::EVENT_REGISTER_SOURCE_TYPES, function(RegisterComponentTypesEvent $event) {
    $event->types[] = MySourceProvider::class;
});
```

## Methods

::: reference
### `displayName()`

**Returns:** `string`

Returns the provider name shown when choosing a Source type. This method is static.
:::

::: reference
### `getOAuthProviderClass()`

**Returns:** `string`

Returns the `League\OAuth2\Client\Provider\AbstractProvider` class Metrix uses to connect. Every `OAuthSource` must implement this static method.
:::

::: reference
### `getClient()`

**Returns:** `GuzzleHttp\Client`

Returns the HTTP client `request()` uses for provider requests, configured with the base URI and credentials. Every `CredentialsSource` must implement it.
:::

::: reference
### `fetchConnection()`

**Returns:** `bool`

Returns whether the saved credentials work. Make a lightweight request to the provider here, because the default on a `CredentialsSource` returns `true` without checking.
:::

::: reference
### `fetchData()`

**Returns:** `array`

**Arguments:** `WidgetDataInterface $widgetData`

Returns the values for a widget. `$widgetData` holds the widget’s `metric`, `dimension` and `period`. For a dated chart, return values keyed by the bucket keys the period generates.
:::

::: reference
### `fetchAvailableMetrics()`

**Returns:** `array`

Returns the metrics editors can pick, as `label` and `value` pairs. Defaults to an empty array.
:::

::: reference
### `fetchAvailableDimensions()`

**Returns:** `array`

Returns the dimensions editors can break data down by, as `label` and `value` pairs. Defaults to an empty array.
:::

::: reference
### `getSettingsHtml()`

**Returns:** `string|null`

Returns the settings form for the Source. The default renders a template from Metrix’s own `sources/_types` folder, so a custom Source should return its own.
:::

::: reference
### `getPrimaryColor()`

**Returns:** `string|null`

Returns the brand colour Metrix uses for the Source.
:::

::: reference
### `getIcon()`

**Returns:** `string|null`

Returns the Source’s icon as SVG markup, or `null` for none.
:::

::: reference
### `supportsDimensions()`

**Returns:** `bool`

Returns whether the Source can answer breakdown widgets such as tables and pie charts. Defaults to `true`. Return `false` for an event-only provider.
:::
