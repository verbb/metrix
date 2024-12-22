# Period

## Methods

Method | Description
--- | ---
`displayName()` | Returns the display name of the period.
`previousDisplayName()` | Returns the display name of the previous period.
`getDateRange()` | Retrieves the start and end dates for the period.
`getPreviousDateRange()` | Retrieves the start and end dates for the previous period.
`getIntervalDimension()` | Returns the interval dimension for grouping data.
`generatePlotDimensions(WidgetData $widgetData, array $rawData)` | Generates plot dimensions based on a daily interval.
`getChartMetadata()` | Provides metadata for charting, including axis label formats (`datePeriodDayShort`) and tooltip formats (`datePeriodDayLong`).