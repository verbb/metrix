<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetData;

use Craft;

use DateTime;
use DateInterval;
use DatePeriod;

class MonthToDate extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Month to Date');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', 'Last Month');
    }

    public static function getDateRange(): array
    {
        $start = new DateTime('first day of this month 00:00:00');
        $end = new DateTime();

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $current = static::getDateRange();
        $start = (clone $current['start'])->modify('-1 month');
        // Shift from the first day so month-end and leap-day dates cannot overflow.
        $end = (clone $current['end'])->modify('first day of this month')->modify('-1 month');
        $end->setDate((int)$end->format('Y'), (int)$end->format('m'), min((int)$current['end']->format('d'), (int)$end->format('t')));

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getIntervalDimension(): string
    {
        return static::INTERVAL_DAY;
    }

    public static function generatePlotDimensions(WidgetData $widgetData, array $rawData): array
    {
        $range = static::getCurrentDateRange();
        $start = (clone $range['start'])->setTime(0, 0, 0);
        $end = (clone $start)->modify('first day of next month')->setTime(0, 0, 0);

        $interval = new DateInterval('P1D');
        $period = new DatePeriod($start, $interval, $end);

        $dimensions = [];

        foreach ($period as $time) {
            $dimensions[] = $time->format('Y-m-d');
        }

        return $dimensions;
    }

    public static function getChartMetadata(): array
    {
        return [
            'xAxisLabelFormat' => 'datePeriodMonthShort',
            'tooltipFormat' => 'datePeriodMonthLong',
        ];
    }
}