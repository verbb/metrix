<?php
namespace verbb\metrix\services;

use verbb\metrix\Metrix;
use verbb\metrix\events\PresetEvent;
use verbb\metrix\models\Preset;
use verbb\metrix\records\Preset as PresetRecord;

use Craft;
use craft\base\Field;
use craft\base\MemoizableArray;
use craft\db\Query;
use craft\errors\MissingComponentException;
use craft\events\ConfigEvent;
use craft\helpers\ArrayHelper;
use craft\helpers\Component as ComponentHelper;
use craft\helpers\Db;
use craft\helpers\Json;
use craft\helpers\ProjectConfig as ProjectConfigHelper;
use craft\helpers\StringHelper;

use yii\base\Component;
use yii\base\InvalidConfigException;
use yii\base\UnknownPropertyException;
use yii\db\ActiveRecord;
use yii\db\Exception;

use Throwable;

class Presets extends Component
{
    // Constants
    // =========================================================================

    public const EVENT_BEFORE_SAVE_PRESET = 'beforeSavePreset';
    public const EVENT_AFTER_SAVE_PRESET = 'afterSavePreset';
    public const EVENT_BEFORE_DELETE_PRESET = 'beforeDeletePreset';
    public const EVENT_BEFORE_APPLY_PRESET_DELETE = 'beforeApplyPresetDelete';
    public const EVENT_AFTER_DELETE_PRESET = 'afterDeletePreset';
    public const CONFIG_PRESETS_KEY = 'metrix.presets';


    // Properties
    // =========================================================================

    private ?MemoizableArray $_presets = null;


    // Public Methods
    // =========================================================================

    public function getAllPresets(): array
    {
        return $this->_presets()->all();
    }

    public function getAllEnabledPresets(): array
    {
        return ArrayHelper::where($this->getAllPresets(), 'enabled', true);
    }

    public function getPresetById(int $presetId): ?Preset
    {
        return ArrayHelper::firstWhere($this->getAllPresets(), 'id', $presetId);
    }

    public function getPresetByUid(string $presetUid): ?Preset
    {
        return ArrayHelper::firstWhere($this->getAllPresets(), 'uid', $presetUid);
    }

    public function getPresetByHandle(string $handle): ?Preset
    {
        return ArrayHelper::firstWhere($this->getAllPresets(), 'handle', $handle, true);
    }

    public function createPresetConfig(Preset $preset): array
    {
        return [
            'name' => $preset->name,
            'handle' => $preset->handle,
            'enabled' => $preset->enabled,
            'sortOrder' => (int)$preset->sortOrder,
            'widgets' => $preset->getSerializedWidgets(),
        ];
    }

    public function savePreset(Preset $preset, bool $runValidation = true): bool
    {
        $isNewPreset = $preset->getIsNew();

        // Fire a 'beforeSavePreset' event
        if ($this->hasEventHandlers(self::EVENT_BEFORE_SAVE_PRESET)) {
            $this->trigger(self::EVENT_BEFORE_SAVE_PRESET, new PresetEvent([
                'preset' => $preset,
                'isNew' => $isNewPreset,
            ]));
        }

        if (!$preset->beforeSave($isNewPreset)) {
            return false;
        }

        if ($runValidation && !$preset->validate()) {
            IconPicker::log('Icon set not saved due to validation error.');

            return false;
        }

        if ($isNewPreset) {
            $preset->uid = StringHelper::UUID();
            
            $preset->sortOrder = (new Query())
                    ->from(['{{%metrix_presets}}'])
                    ->max('[[sortOrder]]') + 1;
        } else if (!$preset->uid) {
            $preset->uid = Db::uidById('{{%metrix_presets}}', $preset->id);
        }

        $configPath = self::CONFIG_PRESETS_KEY . '.' . $preset->uid;
        $configData = $this->createPresetConfig($preset);
        Craft::$app->getProjectConfig()->set($configPath, $configData, "Save the “{$preset->handle}” preset");

        if ($isNewPreset) {
            $preset->id = Db::idByUid('{{%metrix_presets}}', $preset->uid);
        }

        return true;
    }

    public function handleChangedPreset(ConfigEvent $event): void
    {
        $presetUid = $event->tokenMatches[0];
        $data = $event->newValue;

        $transaction = Craft::$app->getDb()->beginTransaction();
        try {
            $presetRecord = $this->_getPresetRecord($presetUid, true);
            $isNewPreset = $presetRecord->getIsNewRecord();

            $presetRecord->name = $data['name'];
            $presetRecord->handle = $data['handle'];
            $presetRecord->enabled = $data['enabled'];
            $presetRecord->sortOrder = $data['sortOrder'];
            $presetRecord->widgets = $data['widgets'];
            $presetRecord->uid = $presetUid;

            // Save the preset
            if ($wasTrashed = (bool)$presetRecord->dateDeleted) {
                $presetRecord->restore();
            } else {
                $presetRecord->save(false);
            }

            $transaction->commit();
        } catch (Throwable $e) {
            $transaction->rollBack();
            throw $e;
        }

        // Clear caches
        $this->_presets = null;

        $preset = $this->getPresetById($presetRecord->id);
        $preset->afterSave($isNewPreset);

        // Fire an 'afterSavePreset' event
        if ($this->hasEventHandlers(self::EVENT_AFTER_SAVE_PRESET)) {
            $this->trigger(self::EVENT_AFTER_SAVE_PRESET, new PresetEvent([
                'preset' => $this->getPresetById($presetRecord->id),
                'isNew' => $isNewPreset,
            ]));
        }
    }

    public function reorderPresets(array $presetIds): bool
    {
        $projectConfig = Craft::$app->getProjectConfig();

        $uidsByIds = Db::uidsByIds('{{%metrix_presets}}', $presetIds);

        foreach ($presetIds as $presetOrder => $presetId) {
            if (!empty($uidsByIds[$presetId])) {
                $presetUid = $uidsByIds[$presetId];
                $projectConfig->set(self::CONFIG_PRESETS_KEY . '.' . $presetUid . '.sortOrder', $presetOrder + 1, "Reorder presets");
            }
        }

        return true;
    }

    public function deletePresetById(int $presetId): bool
    {
        $preset = $this->getPresetById($presetId);

        if (!$preset) {
            return false;
        }

        return $this->deletePreset($preset);
    }

    public function deletePreset(Preset $preset): bool
    {
        // Fire a 'beforeDeletePreset' event
        if ($this->hasEventHandlers(self::EVENT_BEFORE_DELETE_PRESET)) {
            $this->trigger(self::EVENT_BEFORE_DELETE_PRESET, new PresetEvent([
                'preset' => $preset,
            ]));
        }

        if (!$preset->beforeDelete()) {
            return false;
        }

        Craft::$app->getProjectConfig()->remove(self::CONFIG_PRESETS_KEY . '.' . $preset->uid, "Delete the “{$preset->handle}” preset");

        return true;
    }

    public function handleDeletedPreset(ConfigEvent $event): void
    {
        $uid = $event->tokenMatches[0];
        $presetRecord = $this->_getPresetRecord($uid);

        if ($presetRecord->getIsNewRecord()) {
            return;
        }

        $preset = $this->getPresetById($presetRecord->id);

        // Fire a 'beforeApplyPresetDelete' event
        if ($this->hasEventHandlers(self::EVENT_BEFORE_APPLY_PRESET_DELETE)) {
            $this->trigger(self::EVENT_BEFORE_APPLY_PRESET_DELETE, new PresetEvent([
                'preset' => $preset,
            ]));
        }

        $db = Craft::$app->getDb();
        $transaction = $db->beginTransaction();

        try {
            $preset->beforeApplyDelete();

            // Delete the preset
            $db->createCommand()
                ->softDelete('{{%metrix_presets}}', ['id' => $presetRecord->id])
                ->execute();

            $preset->afterDelete();

            $transaction->commit();
        } catch (Throwable $e) {
            $transaction->rollBack();
            throw $e;
        }

        // Clear caches
        $this->_presets = null;

        // Fire an 'afterDeletePreset' event
        if ($this->hasEventHandlers(self::EVENT_AFTER_DELETE_PRESET)) {
            $this->trigger(self::EVENT_AFTER_DELETE_PRESET, new PresetEvent([
                'preset' => $preset,
            ]));
        }
    }

    // Private Methods
    // =========================================================================

    private function _presets(): MemoizableArray
    {
        if (!isset($this->_presets)) {
            $presets = [];

            foreach ($this->_createPresetQuery()->all() as $result) {
                $presets[] = new Preset($result);
            }

            $this->_presets = new MemoizableArray($presets);
        }

        return $this->_presets;
    }

    private function _createPresetQuery(): Query
    {
        return (new Query())
            ->select([
                'id',
                'name',
                'handle',
                'enabled',
                'sortOrder',
                'widgets',
                'dateCreated',
                'dateUpdated',
                'uid',
            ])
            ->from(['{{%metrix_presets}}'])
            ->where(['dateDeleted' => null])
            ->orderBy(['sortOrder' => SORT_ASC]);
    }

    private function _getPresetRecord(string $uid, bool $withTrashed = false): PresetRecord
    {
        $query = $withTrashed ? PresetRecord::findWithTrashed() : PresetRecord::find();
        $query->andWhere(['uid' => $uid]);

        return $query->one() ?? new PresetRecord();
    }
}