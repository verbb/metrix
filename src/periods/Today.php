<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

use Craft;

use DateTime;

class Today extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Today');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', 'Yesterday');
    }

    public static function getDateRange(): array
    {
        $start = new DateTime('today 00:00:00');
        $end = new DateTime();

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = new DateTime('yesterday 00:00:00');
        $end = new DateTime('-1 day');

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getIntervalDimension(): string
    {
        return 'hour';
    }

    public static function formatPlotDimension(string $dimension): string
    {
        // Convert the hour (e.g., "14") into a datetime string
        $date = new DateTime('today');

        return $date->format('Y-m-d') . ' ' . str_pad($dimension, 2, '0', STR_PAD_LEFT) . ':00:00';
    }

    public static function getChartMetadata(): array
    {
        return [
            'xAxisLabelFormat' => 'datePeriodDayShort',
            'tooltipFormat' => 'datePeriodDayLong',
        ];
    }
}
