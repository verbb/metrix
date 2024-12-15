<?php
namespace verbb\metrix\widgets;

use verbb\metrix\Metrix;
use verbb\metrix\base\Widget;
use verbb\metrix\helpers\Schema;

use Craft;
use craft\helpers\App;

use Throwable;

class Counter extends Widget
{
    // Static Methods
    // =========================================================================

    public static function getDataType(): string
    {
        return data\CounterData::class;
    }

    public static function getSettingsSchema(): array
    {
        return [
            Schema::sources(),
            Schema::chartTypes(),
            Schema::widths(),
            Schema::periods(),
            Schema::metrics(),
        ];
    }


}