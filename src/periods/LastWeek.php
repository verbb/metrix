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
        $end = new DateTime('sunday last week 23:59:59');

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = new DateTime('monday -2 weeks 00:00:00');
        $end = new DateTime('sunday -2 weeks 23:59:59');

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
        $end = (clone $range['end'])->modify('+1 day')->setTime(0, 0, 0);

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