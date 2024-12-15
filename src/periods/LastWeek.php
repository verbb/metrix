<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

use Craft;

use DateTime;

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
        $start = new DateTime('monday -2 weeks 00:00:00');
        $end = new DateTime('monday -1 weeks 00:00:00');

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = new DateTime('monday -3 weeks 00:00:00');
        $end = new DateTime('monday -2 weeks 00:00:00');

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