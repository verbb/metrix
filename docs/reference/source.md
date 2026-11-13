# Source

A Source object represents a configured analytics connection. Obtain one from Metrix's Sources service when integration code needs provider capabilities or data fetching. Dashboard templates do not normally call these methods directly.

```php
use verbb\metrix\Metrix;

$source = Metrix::$plugin->getSources()->getSourceByHandle(
    'analytics',
    enabledOnly: true,
    connectedOnly: true,
);

if ($source && $source->supportsDimensions()) {
    $dimensions = $source->fetchAvailableDimensions();
}
```

<span id="attributes"></span>

## Properties

::: reference
### `id`

**Type:** `string|int|null`

The unique identifier for the source, or `null` before it’s saved.
:::

::: reference
### `name`

**Type:** `string|null`

The name of the source.
:::

::: reference
### `handle`

**Type:** `string|null`

The handle of the source.
:::

::: reference
### `enabled`

**Type:** `bool|null`

Whether the source is enabled.
:::

Provider-specific credentials, such as API keys, OAuth tokens and site IDs, live in each Source type’s settings rather than as shared attributes on every Source.

## Methods

::: reference
### `isConfigured()`

**Returns:** `bool`

Returns whether the source has the settings or credentials it needs to connect.
:::

::: reference
### `isConnected()`

**Returns:** `bool`

Returns whether the source is connected, using its saved credentials or OAuth token.
:::

::: reference
### `getCapabilities()`

**Returns:** `array`

Returns the source’s capability flags, keyed as `realtime`, `dimensions`, `connection`, `oauth` and `analyticsScope`.
:::

::: reference
### `supportsRealtime()`

**Returns:** `bool`

Returns whether a realtime widget can use the source. It’s `true` when the source implements `fetchRealtimeData()`.
:::

::: reference
### `supportsDimensions()`

**Returns:** `bool`

Returns whether the source can break data down by dimension, for table and pie widgets.
:::

::: reference
### `supportsAnalyticsScope()`

**Returns:** `bool`

Returns whether the source can apply a View’s analytics scope, such as a path prefix or hostname.
:::

::: reference
### `applyAnalyticsScope()`

**Returns:** `void`

**Arguments:** `array &$request`, `AnalyticsScope $scope`

Changes a provider request to honour a View’s analytics scope. Sources that don’t support scope leave the request unchanged.
:::

::: reference
### `fetchAvailableMetrics()`

**Returns:** `array`

Returns the metrics the source’s provider offers, as `label` and `value` pairs.
:::

::: reference
### `fetchAvailableDimensions()`

**Returns:** `array`

Returns the dimensions the source’s provider offers, as `label` and `value` pairs.
:::

::: reference
### `fetchData()`

**Returns:** `array`

**Arguments:** `WidgetDataInterface $widgetData`

Returns the data for a widget over its period, using the widget’s metric and dimension.
:::

::: reference
### `fetchRealtimeData()`

**Returns:** `array`

**Arguments:** `WidgetDataInterface $widgetData`

Returns a real-time payload when the provider supports it. Implementing this method makes `supportsRealtime()` return `true`.
:::

::: reference
### `fetchConnection()`

**Returns:** `bool`

Returns whether a test request to the provider succeeds with the source’s saved credentials.
:::

::: reference
### `getPrimaryColor()`

**Returns:** `string|null`

Returns the provider’s brand colour, used for the source in the control panel.
:::

::: reference
### `getIcon()`

**Returns:** `string|null`

Returns the provider’s icon as SVG markup, or `null` when it has none.
:::
