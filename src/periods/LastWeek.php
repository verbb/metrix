<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetData;

use Craft;

use DateTime;
use DateInterval;
use DatePeriod;

class LastWeek extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Last Week');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', '2 Weeks Ago');
    }

    public static function getDateRange(): array
    {
        $start = new DateTime('monday last week 00:00:00');
        $end = new DateTime('monday this week 00:00:00');

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = new DateTime('monday this week 00:00:00');
        $start->modify('-2 weeks');
        $end = new DateTime('monday last week 00:00:00');

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
        $dateRange = static::getDateRange();
        $start = $dateRange['start'];
        $end = $dateRange['end'];

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
