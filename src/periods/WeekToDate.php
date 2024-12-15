<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

use Craft;

use DateTime;

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
        return 'date';
    }

    public static function formatPlotDimension(string $dimension): string
    {
        return substr($dimension, 0, 4) . '-' . substr($dimension, 4, 2) . '-' . substr($dimension, 6, 2) . ' 00:00:00';
    }

    public static function getChartMetadata(): array
    {
        return [
            'xAxisLabelFormat' => 'datePeriodWeekShort',
            'tooltipFormat' => 'datePeriodWeekLong',
        ];
    }
}