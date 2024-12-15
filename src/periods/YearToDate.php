<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

use Craft;

use DateTime;

class YearToDate extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Year to Date');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', 'Last Year');
    }

    public static function getDateRange(): array
    {
        $start = new DateTime('first day of January this year 00:00:00');
        $end = new DateTime();

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = new DateTime('first day of January last year 00:00:00');
        $end = new DateTime('now last year');

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