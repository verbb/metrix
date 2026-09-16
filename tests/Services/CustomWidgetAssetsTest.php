<?php

declare(strict_types=1);

use craft\web\AssetBundle;
use Tests\Support\CpRequestContext;
use verbb\metrix\Metrix;
use verbb\metrix\helpers\Plugin;
use verbb\metrix\services\Widgets;
use verbb\metrix\widgets\Counter;

class TestWidgetAsset extends AssetBundle
{
}

class TestBundledWidget extends Counter
{
    public static function getAssetBundle(): ?string
    {
        return TestWidgetAsset::class;
    }
}

it('loads enabled custom widget assets before the first widget exists', function(string $method) {
    CpRequestContext::activate('metrix', 'GET');
    $widgets = Metrix::$plugin->getWidgets();
    $handler = function($event) { $event->types[] = TestBundledWidget::class; };
    $widgets->on(Widgets::EVENT_REGISTER_WIDGET_TYPES, $handler);
    $settings = Metrix::$plugin->getSettings();
    $originalTypes = $settings->enabledWidgetTypes;
    $view = Craft::$app->getView();
    $originalBundles = $view->assetBundles;
    unset($view->assetBundles[TestWidgetAsset::class]);

    try {
        $settings->enabledWidgetTypes = '*';
        Plugin::$method();
        expect($view->assetBundles)->toHaveKey(TestWidgetAsset::class);
    } finally {
        $widgets->off(Widgets::EVENT_REGISTER_WIDGET_TYPES, $handler);
        $settings->enabledWidgetTypes = $originalTypes;
        $view->assetBundles = $originalBundles;
    }
})->with(['registerDashboardAssets', 'registerPresetsAssets']);
