<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;

use Craft;

use DateTime;

class Realtime extends Period
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Realtime');
    }

    public static function previousDisplayName(): string
    {
        return Craft::t('metrix', 'Last Interval');
    }

    public static function getDateRange(): array
    {
        return [
            'start' => new DateTime('-1 minute'),
            'end' => new DateTime(),
        ];
    }

    public static function getPreviousDateRange(): array
    {
        return [
            'start' => new DateTime('-2 minutes'),
            'end' => new DateTime('-1 minute'),
        ];
    }

    public static function getIntervalDimension(): string
    {
        return 'minute';
    }

    public static function formatPlotDimension(string $dimension): string
    {
        return (new DateTime())->format('Y-m-d H:i') . ":$dimension:00";
    }

    public static function getChartMetadata(): array
    {
        return [
            'xAxisLabelFormat' => 'timeShort',
            'tooltipFormat' => 'timeLong',
        ];
    }
}