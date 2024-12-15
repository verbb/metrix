<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

use Craft;

use DateTime;

class LastYear extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Last Year');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', '2 Years Ago');
    }

    public static function getDateRange(): array
    {
        $start = new DateTime('first day of January last year 00:00:00');
        $end = new DateTime('last day of December last year 23:59:59');

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = new DateTime('-2 years first day of January 00:00:00');
        $end = new DateTime('-2 years last day of December 23:59:59');

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
        if (strlen($dimension) === 2) {
            $year = date('Y');
            return "$year-$dimension-01 00:00:00";
        }

        if (strlen($dimension) === 6) {
            return substr($dimension, 0, 4) . '-' . substr($dimension, 4, 2) . '-01 00:00:00';
        }

        return '(not set)';
    }

    public static function getChartMetadata(): array
    {
        return [
            'xAxisLabelFormat' => 'datePeriodYearShort',
            'tooltipFormat' => 'datePeriodYearLong',
        ];
    }
}