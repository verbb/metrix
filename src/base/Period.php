<?php
namespace verbb\metrix\base;

use Craft;
use craft\base\Model;

use Exception;

class Period extends Model implements PeriodInterface
{
    // Properties
    // =========================================================================

    public static array $currentDateRange = [];


    // Static Methods
    // =========================================================================

    public static function getCurrentDateRange(): array
    {
        return static::$currentDateRange ?: static::getDateRange();
    }
}
