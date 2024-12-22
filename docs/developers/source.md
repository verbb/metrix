# Source

## Attributes

Attribute | Description
--- | ---
`id` | The unique identifier for the source.
`name` | The name of the source provider.
`handle` | The handle of the source.
`enabled` | Indicates if the source is enabled.
`apiKey` | The API key used for authenticating with the source provider.
`siteId` | The identifier for the specific site within the provider's platform.
`primaryColor` | The primary color associated with the source provider.
`icon` | The SVG icon for the source provider.
`dateCreated` | The timestamp when the source was created.
`dateUpdated` | The timestamp when the source was last updated.

## Methods

Method | Description
--- | ---
`isConfigured()` | Checks whether the source has been configured with valid credentials.
`isConnected()` | Determines if the source is currently connected.
`fetchAvailableMetrics()` | Retrieves a list of available metrics for the source.
`fetchAvailableDimensions()` | Retrieves a list of available dimensions for the source.
`fetchData(WidgetDataInterface $widgetData)` | Retrieves data based on widget and period configurations.
`fetchRealtimeData()` | Retrieves real-time data, if supported by the source.
`fetchConnection()` | Validates the source connection by testing the credentials.
