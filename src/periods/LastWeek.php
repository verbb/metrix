<?php
namespace verbb\metrix\periods;

use verbb\metrix\base\Period;
use verbb\metrix\base\WidgetData;

use Craft;

use DateTime;
use DateInterval;
use DatePeriod;

class LastWeek extends Period
{
    private const MONDAY_THIS_WEEK = 'monday this week 00:00:00';
    private const ONE_WEEKS_AGO = '-1 weeks';
    private const TWO_WEEKS_AGO = '-2 weeks';
    private const THREE_WEEKS_AGO = '-3 weeks';
    private static ?DateTime $mondayThisWeek = null;

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
        $start = self::getCurrentMonday();
        $start->modify(self::TWO_WEEKS_AGO);
        $end = self::getCurrentMonday();
        $end->modify(self::ONE_WEEKS_AGO);

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getPreviousDateRange(): array
    {
        $start = self::getCurrentMonday();
        $start->modify(self::THREE_WEEKS_AGO);
        $end = self::getCurrentMonday();
        $end->modify(self::TWO_WEEKS_AGO);

        return [
            'start' => $start,
            'end' => $end,
        ];
    }

    public static function getIntervalDimension(): string
    {
        return static::INTERVAL_DAY;
    }

    public static function generatePlotDimensions(WidgetData $widgetData, array $rawData): array
    {
        $start = self::getCurrentMonday();
        $start->modify(self::TWO_WEEKS_AGO);
        $end = self::getCurrentMonday();
        $end->modify(self::ONE_WEEKS_AGO);

        $interval = new DateInterval('P1D');
        $period = new DatePeriod($start, $interval, $end);

        $dimensions = [];

        foreach ($period as $time) {
            $dimensions[] = $time->format('Y-m-d');
        }

        return $dimensions;
    }

    public static function getChartMetadata(): array
    {
        return [
            'xAxisLabelFormat' => 'datePeriodWeekShort',
            'tooltipFormat' => 'datePeriodWeekLong',
        ];
    }

    private static function getCurrentMonday(): DateTime {
        if (!static::$mondayThisWeek instanceof DateTime) {
            static::$mondayThisWeek = new DateTime(self::MONDAY_THIS_WEEK);
        }

        return clone static::$mondayThisWeek;
    }
}
