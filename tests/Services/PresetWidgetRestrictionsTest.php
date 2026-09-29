<?php

declare(strict_types=1);

use Tests\Support\AdminUser;
use Tests\Support\CpRequestContext;
use craft\db\Query;
use craft\helpers\Json;
use verbb\metrix\Metrix;
use verbb\metrix\controllers\DashboardController;
use verbb\metrix\models\View;
use verbb\metrix\records\Preset as PresetRecord;
use verbb\metrix\services\Presets;
use verbb\metrix\services\Sources;
use verbb\metrix\services\Views;
use verbb\metrix\services\Widgets;
use verbb\metrix\sources\Plausible;
use verbb\metrix\widgets\Counter;
use verbb\metrix\widgets\Realtime;

it('does not create hidden widgets through presets or duplication', function(string $scenario) {
    $plugin = Metrix::$plugin;
    $settings = $plugin->getSettings();
    $originalTypes = $settings->enabledWidgetTypes;
    $originalServices = [];
    $transaction = Craft::$app->getDb()->beginTransaction();
    foreach (['sources' => Sources::class, 'views' => Views::class, 'widgets' => Widgets::class, 'presets' => Presets::class] as $name => $class) {
        $originalServices[$name] = $plugin->get($name);
        $plugin->set($name, new $class());
    }
    try {
        $settings->enabledWidgetTypes = [Counter::class];
        $source = new Plausible(['name' => 'Restricted preset source', 'handle' => 'restrictedPresetSource', 'enabled' => true, 'apiKey' => 'fixture', 'siteId' => 'example.test']);
        $view = new View(['name' => 'Restricted preset view', 'handle' => 'restrictedPresetView']);
        expect($plugin->getSources()->saveSource($source))->toBeTrue();
        expect($plugin->getViews()->saveView($view))->toBeTrue();
        $widget = null;
        if (in_array($scenario, ['hiddenExisting', 'duplicateDisabled'], true)) {
            $widget = new Realtime(['width' => 1]);
            $widget->setSource($source);
            $widget->setView($view);
            expect($plugin->getWidgets()->saveWidget($widget))->toBeTrue();
        }
        // Seed persisted preset data without altering deployment project config.
        $types = match ($scenario) {
            'allDisabled' => [Realtime::class],
            'mixedDisabled' => [Counter::class, Realtime::class],
            default => [Counter::class],
        };
        $record = new PresetRecord();
        $record->name = 'Restricted creation preset';
        $record->handle = 'restrictedCreationPreset';
        $record->enabled = true;
        $record->sortOrder = 100;
        $record->widgets = Json::encode(array_map(fn($type) => ['type' => $type, 'width' => 1, 'canonicalMetric' => 'visitors'], $types));
        expect($record->save(false))->toBeTrue();
        CpRequestContext::activate('actions/metrix/dashboard/apply-preset');
        AdminUser::login();
        Craft::$app->getRequest()->getHeaders()->set('Accept', 'application/json');
        Craft::$app->getRequest()->setBodyParams(['view' => $view->handle, 'preset' => $record->handle, 'id' => $widget?->id]);
        $controller = new DashboardController('dashboard', $plugin);
        $response = $scenario === 'duplicateDisabled' ? $controller->actionDuplicateWidget() : $controller->actionApplyPreset();
        $expectedCount = $widget ? 1 : 0;
        expect((int)(new Query())->from('{{%metrix_widgets}}')->where(['viewId' => $view->id])->count())->toBe($expectedCount);
        expect($response->statusCode)->toBe(400);
        expect($response->data['message'])->not->toBeEmpty();
    } finally {
        $transaction->rollBack();
        $settings->enabledWidgetTypes = $originalTypes;
        foreach ($originalServices as $name => $service) $plugin->set($name, $service);
    }
})->with(['allDisabled', 'mixedDisabled', 'hiddenExisting', 'duplicateDisabled']);
