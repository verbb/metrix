<?php

declare(strict_types=1);

use verbb\metrix\Metrix;
use verbb\metrix\models\Preset;
use verbb\metrix\services\Sources;
use verbb\metrix\services\Views;
use verbb\metrix\sources\Plausible;
use verbb\metrix\widgets\Counter;

it('retains editable preset widgets after the last dashboard view is deleted', function() {
    $transaction = Craft::$app->getDb()->beginTransaction();
    $originalSources = Metrix::$plugin->getSources();
    $originalViews = Metrix::$plugin->getViews();
    Metrix::$plugin->set('sources', $sources = new Sources());
    Metrix::$plugin->set('views', $views = new Views());

    try {
        $source = new Plausible(['name' => 'Viewless source', 'handle' => 'viewlessSource', 'enabled' => true, 'apiKey' => 'fixture', 'siteId' => 'example.test']);
        expect($sources->saveSource($source))->toBeTrue();
        foreach ($views->getAllViews() as $view) {
            expect($views->deleteViewById($view->id))->toBeTrue();
        }
        $preset = new Preset(['widgets' => [
            ['type' => Counter::class, 'canonicalMetric' => 'visitors', 'title' => 'Retained widget'],
        ]]);
        $settings = $preset->getComponentSettings();
        expect($settings['hasSource'])->toBeTrue()->and($settings['widgets'])->toHaveCount(1);
        $preset->setWidgets($settings['widgets']);
        expect($preset->getSerializedWidgets()[0]['title'])->toBe('Retained widget');
    } finally {
        $transaction->rollBack();
        Metrix::$plugin->set('sources', $originalSources);
        Metrix::$plugin->set('views', $originalViews);
    }
});
