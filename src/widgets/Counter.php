<?php
namespace verbb\metrix\widgets;

use verbb\metrix\base\Widget;
use verbb\metrix\helpers\Schema;

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
            Schema::titles(),
            Schema::subtitles(),
            Schema::widths(),
            Schema::periods(),
            Schema::metrics(),
        ];
    }
}
