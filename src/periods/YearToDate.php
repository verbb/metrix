<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetData;

use Craft;

use DateTime;
use DateInterval;
use DatePeriod;

class YearToDate extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Year to Date');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', 'Last Year');
    }

    public static function getDateRange(): array
    {
        $start = new DateTime('first day of January this year 00:00:00');
        $end = new DateTime();

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $current = static::getDateRange();
        $start = (clone $current['start'])->modify('-1 year');
        // Shift from the first day so month-end and leap-day dates cannot overflow.
        $end = (clone $current['end'])->modify('first day of this month')->modify('-1 year');
        $end->setDate((int)$end->format('Y'), (int)$end->format('m'), min((int)$current['end']->format('d'), (int)$end->format('t')));

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getIntervalDimension(): string
    {
        return static::INTERVAL_MONTH;
    }

    public static function generatePlotDimensions(WidgetData $widgetData, array $rawData): array
    {
        $range = static::getCurrentDateRange();
        $start = (clone $range['start'])->setTime(0, 0, 0);
        $end = (clone $start)->modify('first day of January next year')->setTime(0, 0, 0);

        $interval = new DateInterval('P1M');
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
            'xAxisLabelFormat' => 'datePeriodYearShort',
            'tooltipFormat' => 'datePeriodYearLong',
        ];
    }
}