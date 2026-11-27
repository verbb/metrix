<?php

declare(strict_types=1);

use Tests\Support\AdminUser;
use Tests\Support\CpRequestContext;
use Tests\Support\NonAdminUser;
use verbb\metrix\base\SourceInterface;
use verbb\metrix\controllers\SourcesController;
use verbb\metrix\helpers\ProviderUrl;
use verbb\metrix\Metrix;
use verbb\metrix\records\Source as SourceRecord;
use verbb\metrix\services\Sources;
use verbb\metrix\sources\Fathom;
use verbb\metrix\sources\GoatCounter;
use verbb\metrix\sources\GoogleAnalytics;
use verbb\metrix\sources\Matomo;
use verbb\metrix\sources\Plausible;

use craft\helpers\Json;
use yii\web\Response;

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

it('keeps configuration-owned settings out of database saves', function() {
    $transaction = Craft::$app->getDb()->beginTransaction();
    $originalSources = Metrix::$plugin->getSources();
    Metrix::$plugin->set('sources', $sources = new Sources());

    try {
        $source = new Fathom([
            'name' => 'Configured persistence fixture',
            'handle' => 'configuredPersistenceFixture',
            'enabled' => false,
            'apiKey' => 'stored-key-marker',
            'siteId' => 'stored-site-marker',
        ]);
        expect($sources->saveSource($source))->toBeTrue();

        $overridesProperty = new ReflectionProperty($sources, '_overrides');
        $overridesProperty->setValue($sources, [
            'sources' => [
                'configuredPersistenceFixture' => [
                    'apiKey' => 'configured-key-marker',
                    'siteId' => 'configured-site-marker',
                ],
                'configuredNewFixture' => [
                    'apiKey' => '$METRIX_CONFIG_KEY',
                    'siteId' => '$METRIX_CONFIG_SITE',
                ],
            ],
        ]);

        $effective = $sources->getSourceById($source->id);
        expect($effective->apiKey)->toBe('configured-key-marker')
            ->and($effective->siteId)->toBe('configured-site-marker');

        AdminUser::login();
        expect($effective->getSettingsHtml())->not->toContain('configured-key-marker');

        $effective->handle = 'renamedPersistenceFixture';
        expect($sources->saveSource($effective))->toBeTrue();

        $stored = $sources->getStoredSourceById($source->id);
        expect($stored->apiKey)->toBe('stored-key-marker')
            ->and($stored->siteId)->toBe('stored-site-marker');

        $newSource = $sources->createSource([
            'type' => Fathom::class,
            'name' => 'Configured new fixture',
            'handle' => 'configuredNewFixture',
            'enabled' => false,
        ]);
        expect($newSource->getSettingsHtml())->toContain('$METRIX_CONFIG_KEY');
        expect($sources->saveSource($newSource))->toBeTrue();

        $newRecord = SourceRecord::findOne(['id' => $newSource->id]);
        $newSettings = Json::decodeIfJson($newRecord->settings);

        expect($newSettings)->not->toHaveKeys(['apiKey', 'siteId']);
    } finally {
        $transaction->rollBack();
        Metrix::$plugin->set('sources', $originalSources);
    }
});

function credentialManagerSourceRequest(array $params, bool $admin = false): Response
{
    if ($admin) {
        AdminUser::login();
    } else {
        NonAdminUser::loginWithPermissions(['metrix-sources', Metrix::MANAGE_SOURCE_CREDENTIALS_PERMISSION]);
    }

    $action = isset($params['setting']) ? 'refresh-settings' : 'save';
    CpRequestContext::activate("actions/metrix/sources/$action");
    $request = Craft::$app->getRequest();
    $request->getHeaders()->set('Accept', 'application/json');
    $request->setBodyParams($params);
    $controller = new SourcesController('sources', Metrix::$plugin);

    return $action === 'save' ? $controller->actionSave() : $controller->actionRefreshSettings();
}

function credentialManagerSaveParams(SourceInterface $source, string $type, array $settings): array
{
    return [
        'sourceId' => $source->id,
        'type' => $type,
        'name' => $source->name,
        'handle' => $source->handle,
        'enabled' => false,
        'types' => [$type => $settings],
    ];
}

describe('Credential managers who are not admins', function() {
    beforeEach(function() {
        $this->transaction = Craft::$app->getDb()->beginTransaction();
        $this->originalSources = Metrix::$plugin->getSources();
        Metrix::$plugin->set('sources', $this->sources = new Sources());
        $this->source = new Matomo([
            'name' => 'Credential manager fixture',
            'handle' => 'credentialManagerFixture',
            'enabled' => false,
            'apiUrl' => 'https://analytics.example.test',
            'apiToken' => '$METRIX_MATOMO_TOKEN',
            'siteId' => '1',
        ]);
        expect($this->sources->saveSource($this->source))->toBeTrue();
    });

    afterEach(function() {
        $this->transaction->rollBack();
        Metrix::$plugin->set('sources', $this->originalSources);
    });

    it('refuses new environment variable references', function() {
        $response = credentialManagerSourceRequest(credentialManagerSaveParams($this->source, Matomo::class, [
            'apiUrl' => 'https://analytics.example.test',
            'apiToken' => '$METRIX_MATOMO_TOKEN',
            'siteId' => '$CRAFT_DB_PASSWORD',
        ]));
        $stored = $this->sources->getStoredSourceById($this->source->id);

        expect(json_encode($response->data, JSON_THROW_ON_ERROR))->toContain('Only admins can use environment variables here.')
            ->and($stored->siteId)->toBe('1');
    });

    it('refuses new environment variable references in OAuth credentials', function() {
        $response = credentialManagerSourceRequest([
            'type' => GoogleAnalytics::class,
            'name' => 'OAuth reference fixture',
            'handle' => 'oauthReferenceFixture',
            'enabled' => false,
            'types' => [
                GoogleAnalytics::class => [
                    'clientId' => '$CRAFT_DB_PASSWORD',
                    'clientSecret' => 'literal-secret',
                ],
            ],
        ]);

        expect(json_encode($response->data, JSON_THROW_ON_ERROR))->toContain('Only admins can use environment variables here.')
            ->and($this->sources->getSourceByHandle('oauthReferenceFixture'))->toBeNull();
    });

    it('lets admins use environment variable references and change endpoints', function() {
        credentialManagerSourceRequest(credentialManagerSaveParams($this->source, Matomo::class, [
            'apiUrl' => 'https://elsewhere.example.test',
            'apiToken' => '$METRIX_MATOMO_TOKEN',
            'siteId' => '$METRIX_MATOMO_SITE',
        ]), true);
        $stored = $this->sources->getStoredSourceById($this->source->id);

        expect($stored->apiUrl)->toBe('https://elsewhere.example.test')
            ->and($stored->siteId)->toBe('$METRIX_MATOMO_SITE');
    });

    it('keeps references an admin saved', function() {
        credentialManagerSourceRequest(credentialManagerSaveParams($this->source, Matomo::class, [
            'apiUrl' => 'https://analytics.example.test',
            'apiToken' => '$METRIX_MATOMO_TOKEN',
            'siteId' => '2',
        ]));
        $stored = $this->sources->getStoredSourceById($this->source->id);

        expect($stored->apiToken)->toBe('$METRIX_MATOMO_TOKEN')
            ->and($stored->siteId)->toBe('2');
    });

    it('asks for saved credentials again when the endpoint changes', function() {
        $response = credentialManagerSourceRequest(credentialManagerSaveParams($this->source, Matomo::class, [
            'apiUrl' => 'https://attacker.example.test',
            'apiToken' => '$METRIX_MATOMO_TOKEN',
            'siteId' => '1',
        ]));

        expect(json_encode($response->data, JSON_THROW_ON_ERROR))->toContain('Enter the credentials again after changing where this connects.')
            ->and($this->sources->getStoredSourceById($this->source->id)->apiUrl)->toBe('https://analytics.example.test');

        credentialManagerSourceRequest(credentialManagerSaveParams($this->source, Matomo::class, [
            'apiUrl' => 'https://attacker.example.test',
            'apiToken' => 'their-own-token',
            'siteId' => '1',
        ]));
        $stored = $this->sources->getStoredSourceById($this->source->id);

        expect($stored->apiUrl)->toBe('https://attacker.example.test')
            ->and($stored->apiToken)->toBe('their-own-token');
    });

    it('asks for saved credentials again when the provider changes', function() {
        $source = new GoatCounter([
            'name' => 'Provider change fixture',
            'handle' => 'providerChangeFixture',
            'enabled' => false,
            'siteUrl' => 'https://analytics.example.test',
            'apiKey' => '$METRIX_API_KEY',
        ]);
        expect($this->sources->saveSource($source))->toBeTrue();

        $response = credentialManagerSourceRequest(credentialManagerSaveParams($source, Plausible::class, [
            'baseUrl' => 'https://attacker.example.test',
            'apiKey' => '$METRIX_API_KEY',
            'siteId' => 'example.test',
        ]));

        expect(json_encode($response->data, JSON_THROW_ON_ERROR))->toContain('Enter the credentials again after changing where this connects.')
            ->and($this->sources->getStoredSourceById($source->id))->toBeInstanceOf(GoatCounter::class);
    });

    it('applies the same rules to settings refreshes', function() {
        ProviderUrl::setResolver(static fn() => []);

        try {
            $moved = credentialManagerSourceRequest([
                'source' => $this->source->handle,
                'setting' => 'siteId',
                'sourceData' => ['apiUrl' => 'https://attacker.example.test'],
            ])->data;

            // A refresh changes the memoized source, so start the second request from the saved one.
            Metrix::$plugin->set('sources', new Sources());

            $referenced = credentialManagerSourceRequest([
                'source' => $this->source->handle,
                'setting' => 'siteId',
                'sourceData' => ['apiToken' => '$CRAFT_DB_PASSWORD'],
            ])->data;
        } finally {
            ProviderUrl::setResolver(null);
        }

        expect($moved['error'] ?? null)->toBe('Enter the credentials again after changing where this connects.')
            ->and($referenced['error'] ?? null)->toBe('Only admins can use environment variables here.');
    });

    it('compares config overrides as the source runs', function() {
        $overridesProperty = new ReflectionProperty($this->sources, '_overrides');
        $overridesProperty->setValue($this->sources, [
            'sources' => [
                $this->source->handle => [
                    'apiToken' => '$METRIX_CONFIG_TOKEN',
                ],
            ],
        ]);

        credentialManagerSourceRequest(credentialManagerSaveParams($this->source, Matomo::class, [
            'apiUrl' => 'https://analytics.example.test',
            'apiToken' => '$METRIX_CONFIG_TOKEN',
            'siteId' => '3',
        ]));

        expect($this->sources->getStoredSourceById($this->source->id)->siteId)->toBe('3');

        $response = credentialManagerSourceRequest(credentialManagerSaveParams($this->source, Matomo::class, [
            'apiUrl' => 'https://attacker.example.test',
            'apiToken' => 'their-own-token',
            'siteId' => '3',
        ]));

        expect(json_encode($response->data, JSON_THROW_ON_ERROR))->toContain('Enter the credentials again after changing where this connects.')
            ->and($this->sources->getStoredSourceById($this->source->id)->apiUrl)->toBe('https://analytics.example.test');
    });
});
