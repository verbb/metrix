<?php

declare(strict_types=1);

use craft\helpers\StringHelper;
use verbb\metrix\Metrix;
use verbb\metrix\models\Preset;
use verbb\metrix\models\View;
use verbb\metrix\sources\Plausible;

beforeEach(function() {
    $this->identityTransaction = Craft::$app->getDb()->beginTransaction();
});

afterEach(function() {
    $this->identityTransaction->rollBack();
});

it('rejects blank and unroutable view identities before persistence', function(string $name, string $handle) {
    $view = new View(['name' => $name, 'handle' => $handle]);
    expect(Metrix::$plugin->getViews()->saveView($view))->toBeFalse()
        ->and($view->hasErrors())->toBeTrue()
        ->and($view->id)->toBeNull();
})->with([
    [' ', 'validHandle'],
    ['Valid name', ''],
    ['Valid name', 'not/a/handle'],
    ['Valid name', 'new'],
    [str_repeat('x', 256), 'validHandle'],
]);

it('reports duplicate source view and preset identities as validation errors', function(string $class, string $table, string $service, string $save, string $attribute) {
    $record = ['name' => 'Existing audit item', 'handle' => 'existingAuditItem', 'uid' => StringHelper::UUID()];
    if ($class === Plausible::class) {
        $record['type'] = Plausible::class;
        $record['enabled'] = false;
    }
    Craft::$app->getDb()->createCommand()->insert($table, $record)->execute();
    $model = new $class(['name' => 'New audit item', 'handle' => 'newAuditItem']);
    $model->$attribute = $record[$attribute];
    expect(Metrix::$plugin->$service()->$save($model))->toBeFalse()
        ->and($model->hasErrors($attribute))->toBeTrue();
})->with([
    'source' => [Plausible::class, '{{%metrix_sources}}', 'getSources', 'saveSource'],
    'view' => [View::class, '{{%metrix_views}}', 'getViews', 'saveView'],
    'preset' => [Preset::class, '{{%metrix_presets}}', 'getPresets', 'savePreset'],
])->with(['name', 'handle']);

it('accepts an unchanged existing identity and enforces stored handle lengths', function(string $class, string $table, int $max) {
    $record = ['name' => 'Audit identity', 'handle' => 'auditIdentity', 'uid' => StringHelper::UUID()];
    if ($class === Plausible::class) {
        $record['type'] = Plausible::class;
        $record['enabled'] = false;
    }
    Craft::$app->getDb()->createCommand()->insert($table, $record)->execute();
    $model = new $class([
        'id' => (int)Craft::$app->getDb()->getLastInsertID(),
        'name' => $record['name'],
        'handle' => $record['handle'],
    ]);
    expect($model->validate())->toBeTrue();
    $model->handle = str_repeat('a', $max + 1);
    expect($model->validate())->toBeFalse()->and($model->hasErrors('handle'))->toBeTrue();
})->with([
    [Plausible::class, '{{%metrix_sources}}', 255],
    [View::class, '{{%metrix_views}}', 255],
    [Preset::class, '{{%metrix_presets}}', 64],
]);

it('keeps source identity outside provider settings', function(array|string $settings) {
    Craft::$app->getDb()->createCommand()->insert('{{%metrix_sources}}', [
        'name' => 'Protected source',
        'handle' => 'protectedSource',
        'enabled' => false,
        'type' => Plausible::class,
        'settings' => '{}',
        'uid' => StringHelper::UUID(),
    ])->execute();
    $protectedId = (int)Craft::$app->getDb()->getLastInsertID();

    if (is_string($settings)) {
        $settings = json_decode($settings, true, 512, JSON_THROW_ON_ERROR);
        $settings['id'] = $protectedId;
        $settings = json_encode($settings, JSON_THROW_ON_ERROR);
    } else {
        $settings['id'] = $protectedId;
    }

    $source = Metrix::$plugin->getSources()->createSource([
        'id' => null,
        'name' => 'New source',
        'handle' => 'newSource',
        'enabled' => false,
        'type' => Plausible::class,
        'settings' => $settings,
    ], false);

    expect($source->id)->toBeNull()
        ->and($source->name)->toBe('New source')
        ->and($source->handle)->toBe('newSource')
        ->and($source->apiKey)->toBe('allowed-setting')
        ->and(Metrix::$plugin->getSources()->saveSource($source))->toBeTrue()
        ->and($source->id)->not->toBe($protectedId)
        ->and(Metrix::$plugin->getSources()->getStoredSourceById($protectedId)->name)->toBe('Protected source');
})->with([
    'array settings' => [[
        'id' => 1,
        'name' => 'Smuggled name',
        'handle' => 'smuggledHandle',
        'apiKey' => 'allowed-setting',
    ]],
    'JSON settings' => [json_encode([
        'id' => 1,
        'name' => 'Smuggled name',
        'handle' => 'smuggledHandle',
        'apiKey' => 'allowed-setting',
    ], JSON_THROW_ON_ERROR)],
]);
