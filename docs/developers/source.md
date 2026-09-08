# Source

## Attributes

Attribute | Description
--- | ---
`id` | The unique identifier for the source.
`name` | The name of the source.
`handle` | The handle of the source.
`enabled` | Whether the source is enabled.
`sortOrder` | Sort order among sources.
`cache` | Cached provider settings payloads.
`uid` | The unique identifier string for the source.
`dateCreated` | When the source was created.
`dateUpdated` | When the source was last updated.

Provider-specific credentials (API keys, OAuth tokens, site IDs, etc.) live in each Source type’s settings — not as shared attributes on every Source.

## Methods

Method | Description
--- | ---
`isConfigured()` | Whether the source has the credentials it needs.
`isConnected()` | Whether the source is currently connected (credentials / OAuth).
`getCapabilities()` | Capability flags: `realtime`, `dimensions`, `connection`, `oauth`, `analyticsScope`.
`supportsRealtime()` | Whether a realtime widget can call this source.
`supportsDimensions()` | Whether dimension breakdowns (table/pie) are supported.
`supportsAnalyticsScope()` | Whether View analytics scope (path/hostname) can be applied.
`applyAnalyticsScope(array &$request, AnalyticsScope $scope)` | Mutates a provider request to honour View scope.
`fetchAvailableMetrics()` | Metrics the provider can expose.
`fetchAvailableDimensions()` | Dimensions the provider can expose.
`fetchData(WidgetDataInterface $widgetData)` | Historical / period data for a widget.
`fetchRealtimeData(WidgetDataInterface $widgetData)` | Realtime payload when supported (optional on the class).
`fetchConnection()` | Validates credentials / connection.
`getPrimaryColor()` / `getIcon()` | Provider branding for the CP.
