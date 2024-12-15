<?php
namespace verbb\metrix\records;

use craft\db\ActiveRecord;
use craft\db\SoftDeleteTrait;

class Preset extends ActiveRecord
{
    // Traits
    // =========================================================================

    use SoftDeleteTrait;


    // Public Methods
    // =========================================================================

    public static function tableName(): string
    {
        return '{{%metrix_presets}}';
    }
}
