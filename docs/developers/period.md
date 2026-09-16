# Period

A Period class defines a dashboard date range and the buckets used to plot it. Obtain registered Period class names from `Metrix::$plugin->getPeriods()->getAllPeriodTypes()`. Custom Periods extend `verbb\metrix\base\Period` and implement the static methods below; see [Custom Period](docs:developers/custom-period) for a complete registration example.

```php
use verbb\metrix\Metrix;

foreach (Metrix::$plugin->getPeriods()->getAllPeriodTypes() as $periodClass) {
    $label = $periodClass::displayName();
    $range = $periodClass::getDateRange();
}
```

## Static Methods

::: reference
### `displayName(): string`

Returns the display name of the period.
:::

::: reference
### `previousDisplayName(): string`

Returns the display name of the previous period.
:::

::: reference
### `getDateRange(): array`

Returns `start` and `end` `DateTime` values for the period. All Time returns an empty array; providers determine the available history for that range.
:::

::: reference
### `getPreviousDateRange(): array`

Returns `start` and `end` `DateTime` values for the comparison period. All Time returns an empty array and has no comparison period.
:::

::: reference
### `getIntervalDimension(): string`

Returns one of the `Period::INTERVAL_*` constants used to group provider data.
:::

::: reference
### `generatePlotDimensions(WidgetData $widgetData, array $rawData): array`

Returns the ordered dimension keys required for the chart. Use `$widgetData` and `$rawData` when the available buckets depend on the Widget or provider response.
:::

::: reference
### `getChartMetadata(): array`

Returns chart metadata such as `xAxisLabelFormat` and `tooltipFormat`.
:::
