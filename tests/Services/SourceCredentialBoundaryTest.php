<?php

declare(strict_types=1);

use Tests\Support\CpRequestContext;
use Tests\Support\NonAdminUser;
use verbb\metrix\controllers\SourcesController;
use verbb\metrix\Metrix;
use verbb\metrix\services\Sources;
use verbb\metrix\sources\Fathom;

it('preserves hidden credentials and redacts delegated save responses', function() {
    $transaction = Craft::$app->getDb()->beginTransaction();
    $originalSources = Metrix::$plugin->getSources();
    Metrix::$plugin->set('sources', $sources = new Sources());

    try {
        $source = new Fathom([
            'name' => 'Delegated save fixture',
            'handle' => 'delegatedSaveFixture',
            'enabled' => false,
            'apiKey' => 'stored-key-marker',
            'siteId' => 'original-site',
        ]);
        expect($sources->saveSource($source))->toBeTrue();

        $overridesProperty = new ReflectionProperty($sources, '_overrides');
        $overridesProperty->setValue($sources, [
            'sources' => [
                $source->handle => [
                    'apiKey' => 'configured-key-marker',
                ],
            ],
        ]);

        NonAdminUser::loginWithPermissions(['metrix-sources']);
        CpRequestContext::activate('actions/metrix/sources/save');
        $settingsHtml = $sources->getSourceById($source->id)->getSettingsHtml();
        $request = Craft::$app->getRequest();
        $request->getHeaders()->set('Accept', 'application/json');
        $request->setBodyParams([
            'sourceId' => $source->id,
            'type' => Fathom::class,
            'name' => $source->name,
            'handle' => $source->handle,
            'enabled' => false,
            'types' => [
                Fathom::class => [
                    'siteId' => 'updated-site',
                ],
            ],
        ]);
        $controller = new SourcesController('sources', Metrix::$plugin);
        $response = $controller->actionSave();
        $saved = $sources->getStoredSourceById($source->id);
        $responseBody = json_encode($response->data, JSON_THROW_ON_ERROR);

        expect($saved->apiKey)->toBe('stored-key-marker')
            ->and($saved->siteId)->toBe('updated-site')
            ->and($settingsHtml)->not->toContain('configured-key-marker')
            ->and($responseBody)->not->toContain('stored-key-marker')
            ->and($responseBody)->not->toContain('configured-key-marker');
    } finally {
        $transaction->rollBack();
        Metrix::$plugin->set('sources', $originalSources);
    }
});

it('redacts credentials from delegated validation failures', function() {
    NonAdminUser::loginWithPermissions(['metrix-sources']);
    CpRequestContext::activate('actions/metrix/sources/save');
    $request = Craft::$app->getRequest();
    $request->getHeaders()->set('Accept', 'application/json');
    $request->setBodyParams([
        'type' => Fathom::class,
        'name' => '',
        'handle' => '',
        'enabled' => false,
        'types' => [
            Fathom::class => [
                'apiKey' => 'rejected-key-marker',
                'siteId' => 'fixture-site',
            ],
        ],
    ]);
    $controller = new SourcesController('sources', Metrix::$plugin);
    $response = $controller->actionSave();
    $responseBody = json_encode($response->data, JSON_THROW_ON_ERROR);

    expect($responseBody)->not->toContain('rejected-key-marker')
        ->and($responseBody)->toContain('permission');
});

it('rejects delegated renames that would detach protected config overrides', function() {
    $transaction = Craft::$app->getDb()->beginTransaction();
    $originalSources = Metrix::$plugin->getSources();
    Metrix::$plugin->set('sources', $sources = new Sources());

    try {
        $source = new Fathom([
            'name' => 'Configured rename fixture',
            'handle' => 'configuredRenameFixture',
            'enabled' => false,
            'apiKey' => 'stored-rename-key-marker',
            'siteId' => 'fixture-site',
        ]);
        expect($sources->saveSource($source))->toBeTrue();

        $overridesProperty = new ReflectionProperty($sources, '_overrides');
        $overridesProperty->setValue($sources, [
            'sources' => [
                $source->handle => [
                    'apiKey' => 'configured-rename-key-marker',
                ],
            ],
        ]);

        NonAdminUser::loginWithPermissions(['metrix-sources']);
        CpRequestContext::activate('actions/metrix/sources/save');
        $request = Craft::$app->getRequest();
        $request->getHeaders()->set('Accept', 'application/json');
        $request->setBodyParams([
            'sourceId' => $source->id,
            'type' => Fathom::class,
            'name' => $source->name,
            'handle' => 'renamedFixture',
            'enabled' => false,
            'types' => [
                Fathom::class => [
                    'siteId' => 'fixture-site',
                ],
            ],
        ]);
        $controller = new SourcesController('sources', Metrix::$plugin);
        $response = $controller->actionSave();
        $stored = $sources->getStoredSourceById($source->id);
        $responseBody = json_encode($response->data, JSON_THROW_ON_ERROR);

        expect($stored->handle)->toBe('configuredRenameFixture')
            ->and($stored->apiKey)->toBe('stored-rename-key-marker')
            ->and($responseBody)->not->toContain('stored-rename-key-marker')
            ->and($responseBody)->not->toContain('configured-rename-key-marker')
            ->and($responseBody)->toContain('protected configuration overrides');
    } finally {
        $transaction->rollBack();
        Metrix::$plugin->set('sources', $originalSources);
    }
});
