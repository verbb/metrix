# Custom Period
Register a custom Period when your dashboard needs a reporting window beyond the built-in date ranges. This example groups the current calendar quarter by month and provides the previous quarter for comparison.

Start with a bootstrapped [Craft module](https://craftcms.com/docs/5.x/extend/module-guide.html) using the namespace `modules\sitemodule`. Create `Quarter.php` beside `Module.php` using the class below. In `Module.php`, place the following imports at the top and the listener inside `init()`, after `parent::init()`. This is a partial module snippet:

```php
use craft\events\RegisterComponentTypesEvent;
use modules\sitemodule\Quarter;
use verbb\metrix\services\Periods;
use yii\base\Event;

Event::on(Periods::class, Periods::EVENT_REGISTER_PERIOD_TYPES, function(RegisterComponentTypesEvent $event) {
    $event->types[] = Quarter::class;
});
```

## Example

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

Select **This Quarter** on a test Line widget. Check the start and end dates against the calendar and compare the monthly totals with the provider. The month keys must match those returned by your Source; this example uses `YYYY-MM-DD` with the first day of each month. Verify the previous-quarter comparison across a year boundary as well. If the period is absent, check whether [configuration](docs:get-started/configuration#enabledperiods) restricts the available periods.
