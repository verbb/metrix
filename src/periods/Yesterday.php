<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

use Craft;

use DateTime;

class Yesterday extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Yesterday');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', '2 Days Ago');
    }

    public static function getDateRange(): array
    {
        $start = new DateTime('yesterday 00:00:00');
        $end = new DateTime('yesterday 23:59:59');

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = new DateTime('-2 days 00:00:00');
        $end = new DateTime('-2 days 23:59:59');

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
        $date = new DateTime('yesterday');
        
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