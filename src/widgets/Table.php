<?php
namespace verbb\metrix\widgets;

use verbb\metrix\Metrix;
use verbb\metrix\base\Widget;
use verbb\metrix\helpers\Schema;

use Craft;
use craft\helpers\App;

use Throwable;

class Table extends Widget
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
            Schema::widths(),
            Schema::periods(),
            Schema::dimensions(),
            Schema::metrics(),
        ];
    }


}