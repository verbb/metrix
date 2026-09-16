<?php

declare(strict_types=1);

use Tests\Support\CpRequestContext;
use craft\web\View;
use verbb\metrix\sources\Fathom;

it('labels namespaced provider choices and their refresh button', function() {
    CpRequestContext::activate('metrix/sources/test', 'GET');
    $view = Craft::$app->getView();
    $mode = $view->getTemplateMode();
    $view->setTemplateMode(View::TEMPLATE_MODE_CP);
    try {
        $source = new Fathom(['id' => 1, 'name' => 'Test', 'handle' => 'test']);
        $source->cache = ['_settingsKey' => $source->getCacheKey(), 'connection' => Fathom::CONNECT_SUCCESS];
        $html = $view->renderString("{% import 'metrix/_macros' as custom %}{% namespace 'types[fathom]' %}{{ custom.providerSettingsField(source, {name: 'siteId', label: 'Fathom Site ID', instructions: 'Select a site.'}) }}{% endnamespace %}", ['source' => $source], View::TEMPLATE_MODE_CP);
        $document = new DOMDocument();
        @$document->loadHTML($html);
        $xpath = new DOMXPath($document);
        $select = $xpath->query('//select')->item(0);
        expect($select)->not->toBeNull();
        expect($xpath->query('//label[@for="' . $select->getAttribute('id') . '"]')->length)->toBe(1);
        expect($xpath->query('//button[@data-refresh-settings]')->item(0)->getAttribute('aria-label'))->toBe('Refresh Fathom Site ID');
    } finally {
        $view->setTemplateMode($mode);
    }
});
