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
