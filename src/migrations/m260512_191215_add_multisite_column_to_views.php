<?php

namespace verbb\metrix\migrations;

use Craft;
use craft\db\Migration;

/**
 * m260512_191215_add_multisite_column_to_views migration.
 */
class m260512_191215_add_multisite_column_to_views extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp(): bool
    {
        $table = Craft::$app->db->schema->getTableSchema('metrix_views');
        if (!isset($table->columns['supportsMultisite'])) {
            $this->addColumn('{{%metrix_views}}', 'supportsMultiSite', $this->boolean()->defaultValue(false));
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public function safeDown(): bool
    {
        $this->dropColumn('{{%metrix_views}}', 'supportsMultiSite');

        return false;
    }
}
