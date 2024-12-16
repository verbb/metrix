<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

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