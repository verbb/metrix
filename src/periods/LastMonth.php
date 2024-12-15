<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

use Craft;

use DateTime;

class LastMonth extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Last Month');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', '2 Months Ago');
    }

    public static function getDateRange(): array
    {
        $start = new DateTime('first day of last month 00:00:00');
        $end = new DateTime('last day of last month 23:59:59');

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = new DateTime('first day of -2 months 00:00:00');
        $end = new DateTime('last day of -2 months 23:59:59');

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
            'xAxisLabelFormat' => 'datePeriodMonthShort',
            'tooltipFormat' => 'datePeriodMonthLong',
        ];
    }
}