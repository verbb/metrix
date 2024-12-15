<?php
namespace verbb\metrix\records;

use craft\db\ActiveRecord;

class Widget extends ActiveRecord
{
    // Public Methods
    // =========================================================================

    public static function tableName(): string
    {
        return '{{%metrix_widgets}}';
    }
}
