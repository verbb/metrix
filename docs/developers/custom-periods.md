# Custom Periods

A Period is a date range editors can pick for a dashboard, along with the buckets its charts are grouped into. Make a custom Period when your dashboard needs a reporting window the built-in date ranges don't cover. This example groups the current calendar quarter by month and offers the previous quarter for comparison.

## Create the Period Class

Extend `verbb\metrix\base\Period` and implement its static methods.

```php
<?php
namespace modules\sitemodule;

use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetData;

use Craft;

use DateTime;
use DateInterval;
use DatePeriod;

class Quarter extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'This Quarter');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', 'Previous Quarter');
    }

    public static function getDateRange(): array
    {
        // Get the current date
        $currentDate = new DateTime();

        // Calculate the start of the current quarter
        $currentQuarter = ceil($currentDate->format('n') / 3);
        $start = new DateTime($currentDate->format('Y') . '-' . (($currentQuarter - 1) * 3 + 1) . '-01 00:00:00');

        // End of the current quarter
        $end = (clone $start)->add(new DateInterval('P3M'))->sub(new DateInterval('PT1S'));

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        // Get the current date
        $currentDate = new DateTime();

        // Calculate the start of the current quarter
        $currentQuarter = ceil($currentDate->format('n') / 3);
        $start = new DateTime($currentDate->format('Y') . '-' . (($currentQuarter - 1) * 3 + 1) . '-01 00:00:00');

        // Start of the previous quarter
        $previousStart = (clone $start)->sub(new DateInterval('P3M'));
        $previousEnd = (clone $start)->sub(new DateInterval('PT1S'));

        return [
            'start' => $previousStart,
            'end' => $previousEnd,
        ];
    }

    public static function getIntervalDimension(): string
    {
        // Data is grouped by month within the quarter
        return static::INTERVAL_MONTH;
    }

    public static function generatePlotDimensions(WidgetData $widgetData, array $rawData): array
    {
        $dateRange = static::getCurrentDateRange();
        $start = $dateRange['start'];
        $end = $dateRange['end'];

        $interval = new DateInterval('P1M'); // Group data by month
        $period = new DatePeriod($start, $interval, $end);

        $dimensions = [];

        foreach ($period as $time) {
            $dimensions[] = $time->format('Y-m-d'); // Use the first day of each month as its bucket key
        }

        return $dimensions;
    }

    public static function getChartMetadata(): array
    {
        return [
            'xAxisLabelFormat' => 'datePeriodMonthShort', // Short format for months
            'tooltipFormat' => 'datePeriodMonthLong', // Long format for detailed tooltips
        ];
    }
}
```

## Register the Period

Metrix finds periods through the `registerPeriodTypes` event. Register your class from your module or plugin’s `init()` method.

```php
use craft\events\RegisterComponentTypesEvent;
use modules\sitemodule\Quarter;
use verbb\metrix\services\Periods;
use yii\base\Event;

Event::on(Periods::class, Periods::EVENT_REGISTER_PERIOD_TYPES, function(RegisterComponentTypesEvent $event) {
    $event->types[] = Quarter::class;
});
```

## Test the Period

Select **This Quarter** on a test Line widget. Check the start and end dates against the calendar and compare the monthly totals with the provider. The month keys must match those returned by your Source; this example uses `YYYY-MM-DD` with the first day of each month. Verify the previous-quarter comparison across a year boundary as well. If the period is absent, check whether [configuration](docs:get-started/configuration#enabledperiods) restricts the available periods.

## Methods

All Period methods are static. See [Period](docs:reference/period) for calling them on registered periods.

::: reference
### `displayName()`

**Returns:** `string`

Returns the name shown in the period picker, such as “This Quarter”.
:::

::: reference
### `previousDisplayName()`

**Returns:** `string`

Returns the name of the comparison period, such as “Previous Quarter”.
:::

::: reference
### `getDateRange()`

**Returns:** `array`

Returns the `start` and `end` `DateTime` values for the period. Return an empty array for an open-ended range like All Time, and the Source decides how much history to fetch.
:::

::: reference
### `getPreviousDateRange()`

**Returns:** `array`

Returns the `start` and `end` `DateTime` values for the comparison period. Return an empty array when the period has no comparison.
:::

::: reference
### `getIntervalDimension()`

**Returns:** `string`

Returns how Sources group data within the period, as one of the `Period::INTERVAL_MINUTE`, `INTERVAL_HOUR`, `INTERVAL_DAY`, `INTERVAL_MONTH` or `INTERVAL_YEAR` constants.
:::

::: reference
### `generatePlotDimensions()`

**Returns:** `array`

**Arguments:** `WidgetData $widgetData`, `array $rawData`

Returns the ordered bucket keys a chart plots. The keys must match the ones the Source returns, so missing buckets can be filled. Use `$widgetData` and `$rawData` when the buckets depend on the widget or the provider response.
:::

::: reference
### `getChartMetadata()`

**Returns:** `array`

Returns chart formatting hints, such as `xAxisLabelFormat` and `tooltipFormat`.
:::
