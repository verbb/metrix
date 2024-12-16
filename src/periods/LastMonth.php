<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

use Craft;

use DateTime;
use DateInterval;
use DatePeriod;

class LastMonth extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Last Month');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', '2 Months Ago');
    }

    public static function getDateRange(): array
    {
        $start = new DateTime('first day of last month 00:00:00');
        $end = new DateTime('last day of last month 23:59:59');

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = new DateTime('first day of -2 months 00:00:00');
        $end = new DateTime('last day of -2 months 23:59:59');

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getIntervalDimension(): string
    {
        return static::INTERVAL_DAY;
    }

    public static function generatePlotDimensions(): array
    {
        $start = new DateTime('first day of last month 00:00:00');
        $end = new DateTime('first day of this month 00:00:00');

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