<?php

declare(strict_types=1);

use craft\events\ConfigEvent;
use craft\helpers\StringHelper;
use verbb\metrix\services\Presets;

beforeEach(function() {
    $this->presetTransaction = Craft::$app->getDb()->beginTransaction();
    $this->presetService = new Presets();
});

afterEach(function() {
    $this->presetTransaction->rollBack();
});

function presetConfigEvent(string $uid, array $data): ConfigEvent
{
    $event = new ConfigEvent(['path' => 'metrix.presets.' . $uid, 'newValue' => $data]);
    $event->tokenMatches = [$uid];
    return $event;
}

it('reuses a deleted preset identity when applying replacement project config', function() {
    $uid = StringHelper::UUID();
    $config = ['name' => 'Audit reusable preset', 'handle' => 'auditReusablePreset', 'enabled' => true, 'sortOrder' => 20, 'widgets' => []];
    $this->presetService->handleChangedPreset(presetConfigEvent($uid, $config));
    $this->presetService->handleDeletedPreset(presetConfigEvent($uid, []));
    $newUid = StringHelper::UUID();
    $this->presetService->handleChangedPreset(presetConfigEvent($newUid, $config));

    expect($this->presetService->getPresetByHandle($config['handle'])->uid)->toBe($newUid);
});

it('reuses identities retained by presets deleted in an earlier version', function() {
    $oldUid = StringHelper::UUID();
    $config = ['name' => 'Audit legacy preset', 'handle' => 'auditLegacyPreset', 'enabled' => true, 'sortOrder' => 21, 'widgets' => []];
    $this->presetService->handleChangedPreset(presetConfigEvent($oldUid, $config));
    Craft::$app->getDb()->createCommand()->softDelete('{{%metrix_presets}}', ['uid' => $oldUid])->execute();
    $newUid = StringHelper::UUID();
    $this->presetService->handleChangedPreset(presetConfigEvent($newUid, $config));

    expect($this->presetService->getPresetByHandle($config['handle'])->uid)->toBe($newUid);
});

it('restores a deleted preset from project config without changing its UID', function() {
    $uid = StringHelper::UUID();
    $config = ['name' => 'Audit restored preset', 'handle' => 'auditRestoredPreset', 'enabled' => true, 'sortOrder' => 22, 'widgets' => []];
    $this->presetService->handleChangedPreset(presetConfigEvent($uid, $config));
    $id = $this->presetService->getPresetByUid($uid)->id;
    $this->presetService->handleDeletedPreset(presetConfigEvent($uid, []));
    $this->presetService->handleChangedPreset(presetConfigEvent($uid, $config));

    expect($this->presetService->getPresetByUid($uid)->id)->toBe($id);
});
