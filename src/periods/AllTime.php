<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetData;

use Craft;

use DateTime;
use DateInterval;
use DatePeriod;

class AllTime extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'All Time');
    }

    public static function previousDisplayName(): string
    {
        return '';
    }

    public static function getDateRange(): array
    {
        return [];
    }

    public static function getPreviousDateRange(): array
    {
        return [];
    }

    public static function getIntervalDimension(): string
    {
        return static::INTERVAL_MONTH;
    }

    public static function generatePlotDimensions(WidgetData $widgetData, array $rawData): array
    {
        if (!$rawData) {
            return [];
        }

        $firstDate = min(array_keys($rawData));
        $start = (new DateTime($firstDate))->modify('first day of this month')->setTime(0, 0);
        $end = new DateTime('first day of next month midnight');

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
