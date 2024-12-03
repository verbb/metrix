<?php
namespace verbb\metrix\migrations;

use craft\db\Migration;
use craft\helpers\MigrationHelper;

use verbb\auth\Auth;

class Install extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        // Ensure that the Auth module kicks off setting up tables
        Auth::$plugin->migrator->up();

        $this->createTables();
        $this->createIndexes();

        return true;
    }

    public function safeDown(): bool
    {
        $this->dropForeignKeys();
        $this->dropTables();

        // Delete all tokens for this plugin
        Auth::$plugin->getTokens()->deleteTokensByOwner('metrix');

        return true;
    }

    public function createTables(): void
    {
        $this->archiveTableIfExists('{{%metrix_sources}}');
        $this->createTable('{{%metrix_sources}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string()->notNull(),
            'handle' => $this->string()->notNull(),
            'enabled' => $this->boolean(),
            'type' => $this->string()->notNull(),
            'settings' => $this->text(),
            'sortOrder' => $this->smallInteger()->unsigned(),
            'dateCreated' => $this->dateTime()->notNull(),
            'dateUpdated' => $this->dateTime()->notNull(),
            'uid' => $this->uid(),
        ]);
    }

    public function createIndexes(): void
    {
        $this->createIndex(null, '{{%metrix_sources}}', ['name'], true);
        $this->createIndex(null, '{{%metrix_sources}}', ['handle'], true);
    }

    public function dropTables(): void
    {
        $this->dropTableIfExists('{{%metrix_sources}}');
    }

    public function dropForeignKeys(): void
    {
        if ($this->db->tableExists('{{%metrix_sources}}')) {
            MigrationHelper::dropAllForeignKeysOnTable('{{%metrix_sources}}', $this);
        }
    }
}
