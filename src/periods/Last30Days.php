<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

use Craft;

use DateTime;
use DateInterval;
use DatePeriod;

class Last30Days extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Last 30 Days');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', 'Previous 30 Days');
    }

    public static function getDateRange(): array
    {
        $start = new DateTime('-30 days 00:00:00');
        $end = new DateTime();

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = new DateTime('-60 days 00:00:00');
        $end = new DateTime('-31 days 23:59:59');

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
        $start = new DateTime('-30 days 00:00:00');
        $end = new DateTime('tomorrow 00:00:00');

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
            'xAxisLabelFormat' => 'datePeriodDayShort',
            'tooltipFormat' => 'datePeriodDayLong',
        ];
    }
}