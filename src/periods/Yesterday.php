<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

use Craft;

use DateTime;
use DateInterval;
use DatePeriod;

class Yesterday extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Yesterday');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', '2 Days Ago');
    }

    public static function getDateRange(): array
    {
        $start = new DateTime('yesterday 00:00:00');
        $end = new DateTime('yesterday 23:59:59');

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = new DateTime('-2 days 00:00:00');
        $end = new DateTime('-2 days 23:59:59');

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getIntervalDimension(): string
    {
        return static::INTERVAL_HOUR;
    }

    public static function generatePlotDimensions(): array
    {
        $start = new DateTime('yesterday 00:00:00');
        $end = new DateTime('today 01:00:00');

        $interval = new DateInterval('PT1H');
        $period = new DatePeriod($start, $interval, $end);

        $dimensions = [];

        foreach ($period as $time) {
            $dimensions[] = $time->format('Y-m-d H:00:00');
        }

        return $dimensions;
    }

    public static function getChartMetadata(): array
    {
        return [
            'xAxisLabelFormat' => 'datePeriodDayShort',
            'tooltipFormat' => 'datePeriodDayLong',
        ];
    }
}