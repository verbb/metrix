<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

use Craft;

use DateTime;
use DateInterval;
use DatePeriod;

class WeekToDate extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Week to Date');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', 'Last Week');
    }

    public static function getDateRange(): array
    {
        $start = new DateTime('monday this week 00:00:00');
        $end = new DateTime();

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = new DateTime('monday last week 00:00:00');
        $end = new DateTime('-7 days');

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
        $start = new DateTime('monday this week 00:00:00');
        $end = new DateTime('monday next week 00:00:00');

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
            'xAxisLabelFormat' => 'datePeriodWeekShort',
            'tooltipFormat' => 'datePeriodWeekLong',
        ];
    }
}