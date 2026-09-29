<?php
namespace verbb\metrix\base;

use Craft;
use craft\base\Model;

use Exception;

class Period extends Model implements PeriodInterface
{
    // Constants
    // =========================================================================

    public const INTERVAL_MINUTE = 'minute';
    public const INTERVAL_HOUR = 'hour';
    public const INTERVAL_DAY = 'day';
    public const INTERVAL_MONTH = 'month';
    public const INTERVAL_YEAR = 'year';


    // Properties
    // =========================================================================

    public static array $currentDateRange = [];


    // Static Methods
    // =========================================================================

    public static function getCurrentDateRange(): array
    {
        return static::$currentDateRange ?: static::getDateRange();
    }

    /**
     * Run a callback while a temporary date range is active (e.g. previous-period plot buckets).
     */
    public static function withDateRange(array $dateRange, callable $callback): mixed
    {
        $originalRange = static::$currentDateRange;

        try {
            static::$currentDateRange = $dateRange;

            return $callback();
        } finally {
            static::$currentDateRange = $originalRange;
        }
    }
}
