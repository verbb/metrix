<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

use Craft;

use DateTime;
use DateInterval;
use DatePeriod;

class LastYear extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Last Year');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', '2 Years Ago');
    }

    public static function getDateRange(): array
    {
        $start = new DateTime('first day of January last year 00:00:00');
        $end = new DateTime('last day of December last year 23:59:59');

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = new DateTime('-2 years first day of January 00:00:00');
        $end = new DateTime('-2 years last day of December 23:59:59');

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getIntervalDimension(): string
    {
        return static::INTERVAL_MONTH;
    }

    public static function generatePlotDimensions(): array
    {
        $start = new DateTime('first day of January last year 00:00:00');
        $end = new DateTime('first day of January this year 00:00:00');

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