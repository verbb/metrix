<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetData;

use Craft;

use DateTime;
use DateInterval;
use DatePeriod;

class Realtime extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Realtime');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', 'Last Interval');
    }

    public static function getDateRange(): array
    {
        return [
            'start' => new DateTime('-1 minute'),
            'end' => new DateTime(),
        ];
    }

    public static function getPreviousDateRange(): array
    {
        return [
            'start' => new DateTime('-2 minutes'),
            'end' => new DateTime('-1 minute'),
        ];
    }

    public static function getIntervalDimension(): string
    {
        return static::INTERVAL_MINUTE;
    }

    public static function generatePlotDimensions(WidgetData $widgetData, array $rawData): array
    {
        $start = new DateTime('today 00:00:00');
        $end = new DateTime('tomorrow 01:00:00');

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
            'xAxisLabelFormat' => 'timeShort',
            'tooltipFormat' => 'timeLong',
        ];
    }
}