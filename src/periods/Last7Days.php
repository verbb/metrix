<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

use Craft;

use DateTime;

class Last7Days extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Last 7 Days');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', 'Previous 7 Days');
    }

    public static function getDateRange(): array
    {
        $start = new DateTime('-7 days 00:00:00');
        $end = new DateTime();

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = new DateTime('-14 days 00:00:00');
        $end = new DateTime('-7 days 23:59:59');

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
            'xAxisLabelFormat' => 'datePeriodDayShort',
            'tooltipFormat' => 'datePeriodDayLong',
        ];
    }
}