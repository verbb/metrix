<?php
namespace verbb\metrix\records;

use craft\db\ActiveRecord;

class View extends ActiveRecord
{
    // Public Methods
    // =========================================================================

    public static function tableName(): string
    {
        return '{{%metrix_views}}';
    }
}
