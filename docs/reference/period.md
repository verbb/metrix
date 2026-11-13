# Period

A Period class defines a dashboard date range and the buckets used to plot it. Obtain registered Period class names from `Metrix::$plugin->getPeriods()->getAllPeriodTypes()`. Custom Periods extend `verbb\metrix\base\Period` and implement the static methods below. See [Custom Periods](docs:developers/custom-periods) for a complete registration example.

```php
use verbb\metrix\Metrix;

foreach (Metrix::$plugin->getPeriods()->getAllPeriodTypes() as $periodClass) {
    $label = $periodClass::displayName();
    $range = $periodClass::getDateRange();
}
```

## Static Methods

::: reference
### `displayName()`

**Returns:** `string`

Returns the name of the period, shown in the period picker.
:::

::: reference
### `previousDisplayName()`

**Returns:** `string`

Returns the name of the comparison period.
:::

::: reference
### `getDateRange()`

**Returns:** `array`

Returns `start` and `end` `DateTime` values for the period. All Time returns an empty array, and providers determine the available history for that range.
:::

::: reference
### `getPreviousDateRange()`

**Returns:** `array`

Returns `start` and `end` `DateTime` values for the comparison period. All Time returns an empty array and has no comparison period.
:::

::: reference
### `getIntervalDimension()`

**Returns:** `string`

Returns one of the `Period::INTERVAL_*` constants used to group provider data.
:::

::: reference
### `generatePlotDimensions()`

**Returns:** `array`

**Arguments:** `WidgetData $widgetData`, `array $rawData`

Returns the ordered dimension keys required for the chart. Use `$widgetData` and `$rawData` when the available buckets depend on the widget or provider response.
:::

::: reference
### `getChartMetadata()`

**Returns:** `array`

Returns chart metadata such as `xAxisLabelFormat` and `tooltipFormat`.
:::
