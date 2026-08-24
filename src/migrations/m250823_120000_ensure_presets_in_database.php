<?php
namespace verbb\metrix\migrations;

use verbb\metrix\Metrix;

use craft\db\Migration;

class m250823_120000_ensure_presets_in_database extends Migration
{
    public function safeUp(): bool
    {
        Metrix::$plugin->getPresets()->ensureDefaultPresets();

        return true;
    }

    public function safeDown(): bool
    {
        return true;
    }
}
