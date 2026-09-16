<?php

declare(strict_types=1);

use Tests\Support\CpRequestContext;
use craft\web\View;
use verbb\metrix\sources\Fathom;

it('preserves a saved provider choice while its option cache is unavailable', function(bool $connected) {
    CpRequestContext::activate('metrix/sources/test', 'GET');
    $source = new Fathom(['id' => 1, 'handle' => 'test', 'siteId' => 'SAVED-SITE']);
    $source->cache = ['_settingsKey' => $source->getCacheKey()];
    if ($connected) $source->cache['connection'] = Fathom::CONNECT_SUCCESS;
    $html = Craft::$app->getView()->renderString("{% import 'metrix/_macros' as custom %}{{ custom.providerSettingsField(source, {name: 'siteId', label: 'Site ID', instructions: 'Select a site.'}) }}", ['source' => $source], View::TEMPLATE_MODE_CP);
    $document = new DOMDocument();
    @$document->loadHTML($html);
    $xpath = new DOMXPath($document);
    expect($xpath->query('//select[@name="siteId" and not(@disabled)]/option[@selected and @value="SAVED-SITE"]')->length)->toBe(1);
})->with([true, false]);

it('does not restore removed choices after a successful empty provider refresh', function() {
    CpRequestContext::activate('metrix/sources/test', 'GET');
    $source = new Fathom(['id' => 1, 'handle' => 'test', 'siteId' => 'REMOVED-SITE']);
    $source->cache = ['_settingsKey' => $source->getCacheKey(), 'connection' => Fathom::CONNECT_SUCCESS, 'siteId' => []];
    $html = Craft::$app->getView()->renderString("{% import 'metrix/_macros' as custom %}{{ custom.providerSettingsField(source, {name: 'siteId', label: 'Site ID', instructions: 'Select a site.'}) }}", ['source' => $source], View::TEMPLATE_MODE_CP);
    expect($html)->not->toContain('value="REMOVED-SITE"');
});
