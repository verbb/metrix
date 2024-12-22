# Custom Period
You can register your own Period to add support for other intervals and durations, or even extend an existing Period.

```php
namespace modules\sitemodule;

use craft\events\RegisterComponentTypesEvent;
use modules\sitemodule\MyPeriod;
use verbb\metrix\services\Periods;
use yii\base\Event;

Event::on(Periods::class, Periods::EVENT_REGISTER_PERIOD_TYPES, function(RegisterComponentTypesEvent $event) {
    $event->types[] = MyPeriod::class;
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
        $end = (clone $start)->add(new DateInterval('P3M'))->sub(new DateInterval('P1D'));

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
        $previousEnd = (clone $start)->sub(new DateInterval('P1D'));

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
        $dateRange = static::getDateRange();
        $start = $dateRange['start'];
        $end = $dateRange['end'];

        $interval = new DateInterval('P1M'); // Group data by month
        $period = new DatePeriod($start, $interval, $end);

        $dimensions = [];

        foreach ($period as $time) {
            $dimensions[] = $time->format('Y-m'); // Format as year and month (e.g., "2024-01")
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