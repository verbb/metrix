<?php
namespace verbb\metrix\widgets;

use verbb\metrix\base\Widget;
use verbb\metrix\helpers\Schema;

class Pie extends Widget
{
    // Static Methods
    // =========================================================================

    public static function supportsDimensions(): bool
    {
        return true;
    }

    public static function getDataType(): string
    {
        return data\DimensionData::class;
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
            Schema::dimensions(),
            Schema::metrics(),
            Schema::limits(['value' => '10']),
        ];
    }
}
