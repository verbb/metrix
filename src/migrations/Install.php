<?php
namespace verbb\metrix\migrations;

use verbb\metrix\Metrix;
use verbb\metrix\models\Preset;
use verbb\metrix\models\View;

use Craft;
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
        $this->createForeignKeys();
        $this->createDefaultData();

        return true;
    }

    public function safeDown(): bool
    {
        $this->dropProjectConfig();
        $this->dropForeignKeys();
        $this->dropTables();

        // Delete all tokens for this plugin
        Auth::$plugin->getTokens()->deleteTokensByOwner('metrix');

        return true;
    }

    public function createTables(): void
    {
        $this->archiveTableIfExists('{{%metrix_presets}}');
        $this->createTable('{{%metrix_presets}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string()->notNull(),
            'handle' => $this->string(64)->notNull(),
            'enabled' => $this->string()->notNull()->defaultValue('true'),
            'widgets' => $this->text(),
            'sortOrder' => $this->smallInteger()->unsigned(),
            'dateDeleted' => $this->dateTime(),
            'dateCreated' => $this->dateTime()->notNull(),
            'dateUpdated' => $this->dateTime()->notNull(),
            'uid' => $this->uid(),
        ]);

        $this->archiveTableIfExists('{{%metrix_sources}}');
        $this->createTable('{{%metrix_sources}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string()->notNull(),
            'handle' => $this->string()->notNull(),
            'enabled' => $this->boolean(),
            'type' => $this->string()->notNull(),
            'settings' => $this->text(),
            'sortOrder' => $this->smallInteger()->unsigned(),
            'cache' => $this->text(),
            'dateLastFetch' => $this->dateTime(),
            'dateCreated' => $this->dateTime()->notNull(),
            'dateUpdated' => $this->dateTime()->notNull(),
            'uid' => $this->uid(),
        ]);

        $this->archiveTableIfExists('{{%metrix_views}}');
        $this->createTable('{{%metrix_views}}', [
            'id' => $this->primaryKey(),
            'name' => $this->string()->notNull(),
            'handle' => $this->string()->notNull(),
            'settings' => $this->text(),
            'sortOrder' => $this->smallInteger()->unsigned(),
            'dateCreated' => $this->dateTime()->notNull(),
            'dateUpdated' => $this->dateTime()->notNull(),
            'uid' => $this->uid(),
        ]);

        $this->archiveTableIfExists('{{%metrix_widgets}}');
        $this->createTable('{{%metrix_widgets}}', [
            'id' => $this->primaryKey(),
            'sourceId' => $this->integer()->notNull(),
            'viewId' => $this->integer()->notNull(),
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
        $this->createIndex(null, '{{%metrix_presets}}', ['name'], true);
        $this->createIndex(null, '{{%metrix_presets}}', ['handle'], true);

        $this->createIndex(null, '{{%metrix_sources}}', ['name'], true);
        $this->createIndex(null, '{{%metrix_sources}}', ['handle'], true);

        $this->createIndex(null, '{{%metrix_views}}', ['name'], true);
        $this->createIndex(null, '{{%metrix_views}}', ['handle'], true);

        $this->createIndex(null, '{{%metrix_widgets}}', ['sourceId'], false);
        $this->createIndex(null, '{{%metrix_widgets}}', ['viewId'], false);
    }

    public function createForeignKeys(): void
    {
        $this->addForeignKey(null, '{{%metrix_widgets}}', ['sourceId'], '{{%metrix_sources}}', ['id'], 'CASCADE', null);
        $this->addForeignKey(null, '{{%metrix_widgets}}', ['viewId'], '{{%metrix_views}}', ['id'], 'CASCADE', null);
    }

    public function dropTables(): void
    {
        $this->dropTableIfExists('{{%metrix_sources}}');
        $this->dropTableIfExists('{{%metrix_views}}');
        $this->dropTableIfExists('{{%metrix_widgets}}');
    }

    public function dropForeignKeys(): void
    {
        if ($this->db->tableExists('{{%metrix_sources}}')) {
            MigrationHelper::dropAllForeignKeysOnTable('{{%metrix_sources}}', $this);
        }

        if ($this->db->tableExists('{{%metrix_views}}')) {
            MigrationHelper::dropAllForeignKeysOnTable('{{%metrix_views}}', $this);
        }

        if ($this->db->tableExists('{{%metrix_widgets}}')) {
            MigrationHelper::dropAllForeignKeysOnTable('{{%metrix_widgets}}', $this);
        }
    }

    public function dropProjectConfig(): void
    {
        Craft::$app->getProjectConfig()->remove('metrix');
    }

    public function createDefaultData(): void
    {
        $view = new View([
            'name' => 'Default',
            'handle' => 'default',
        ]);

        Metrix::$plugin->getViews()->saveView($view);

        $projectConfig = Craft::$app->projectConfig;

        // Don't make the same config changes twice
        $installed = ($projectConfig->get('plugins.metrix', true) !== null);
        $configExists = ($projectConfig->get('metrix', true) !== null);

        if (!$installed && !$configExists) {
            $this->_defaultPreset();
        }
    }

    
    // Private Methods
    // =========================================================================

    private function _defaultPreset(): void
    {
        $widgets = [
            [
                'type' => 'verbb\\metrix\\widgets\\Line',
                'period' => 'verbb\\metrix\\periods\\Last7Days',
                'metric' => 'sessions',
                'width' => '2',
            ],
            [
                'type' => 'verbb\\metrix\\widgets\\Counter',
                'period' => 'verbb\\metrix\\periods\\Realtime',
                'metric' => 'activeUsers',
                'width' => '1',
            ],
            [
                'type' => 'verbb\\metrix\\widgets\\Counter',
                'period' => 'verbb\\metrix\\periods\\Last7Days',
                'metric' => 'sessions',
                'width' => '1',
            ],
            [
                'type' => 'verbb\\metrix\\widgets\\Pie',
                'period' => 'verbb\\metrix\\periods\\Last7Days',
                'metric' => 'sessions',
                'dimension' => 'browser',
                'width' => '1',
            ],
            [
                'type' => 'verbb\\metrix\\widgets\\Table',
                'period' => 'verbb\\metrix\\periods\\Last7Days',
                'metric' => 'sessions',
                'dimension' => 'operatingSystem',
                'width' => '1',
            ],
            [
                'type' => 'verbb\\metrix\\widgets\\Table',
                'period' => 'verbb\\metrix\\periods\\Last7Days',
                'metric' => 'sessions',
                'dimension' => 'country',
                'width' => '1',
            ],
        ];

        $preset = new Preset([
            'name' => 'Default',
            'handle' => 'default',
            'enabled' => true,
            'widgets' => $widgets,
        ]);

        Metrix::$plugin->getPresets()->savePreset($preset);
    }
}
