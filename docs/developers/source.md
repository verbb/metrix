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

The unique identifier for the source.
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

Provider-specific credentials (API keys, OAuth tokens, site IDs, etc.) live in each Source type’s settings — not as shared attributes on every Source.

## Methods

::: reference
### `isConfigured(): bool`

**Returns:** `bool`

Whether the source has the credentials it needs.
:::

::: reference
### `isConnected(): bool`

**Returns:** `bool`

Whether the source is currently connected (credentials / OAuth).
:::

::: reference
### `getCapabilities(): array`

**Returns:** `array`

Capability flags: `realtime`, `dimensions`, `connection`, `oauth`, `analyticsScope`.
:::

::: reference
### `supportsRealtime(): bool`

**Returns:** `bool`

Whether a realtime widget can call this source.
:::

::: reference
### `supportsDimensions(): bool`

**Returns:** `bool`

Whether dimension breakdowns (table/pie) are supported.
:::

::: reference
### `supportsAnalyticsScope(): bool`

**Returns:** `bool`

Whether View analytics scope (path/hostname) can be applied.
:::

::: reference
### `applyAnalyticsScope(array &$request, AnalyticsScope $scope): void`

**Returns:** `void`

Mutates a provider request to honour View scope.
:::

::: reference
### `fetchAvailableMetrics(): array`

**Returns:** `array`

Metrics the provider can expose.
:::

::: reference
### `fetchAvailableDimensions(): array`

**Returns:** `array`

Dimensions the provider can expose.
:::

::: reference
### `fetchData(WidgetDataInterface $widgetData): array`

**Returns:** `array`

Historical / period data for a widget.
:::

::: reference
### `fetchRealtimeData(WidgetDataInterface $widgetData): array`

**Returns:** `array`

Returns a real-time payload when the provider supports it. Implementing this method makes `supportsRealtime()` return `true`.
:::

::: reference
### `fetchConnection(): bool`

**Returns:** `bool`

Validates credentials / connection.
:::

::: reference
### `getPrimaryColor(): ?string` and `getIcon(): ?string`

**Returns:** `string|null`

Provider branding for the CP.
:::
