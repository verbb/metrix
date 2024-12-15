<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

use Craft;

use DateTime;

class Last12Months extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Last 12 Months');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', 'Previous 12 Months');
    }

    public static function getDateRange(): array
    {
        $start = new DateTime('-12 months 00:00:00');
        $end = new DateTime();

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = new DateTime('-24 months 00:00:00');
        $end = new DateTime('-12 months 23:59:59');

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getIntervalDimension(): string
    {
        return 'month';
    }

    public static function formatPlotDimension(string $dimension): string
    {
        return substr($dimension, 0, 4) . '-' . substr($dimension, 4, 2) . '-01 00:00:00';
    }

    public static function getChartMetadata(): array
    {
        return [
            'xAxisLabelFormat' => 'datePeriodYearShort',
            'tooltipFormat' => 'datePeriodYearLong',
        ];
    }
}