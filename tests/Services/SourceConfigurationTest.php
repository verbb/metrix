<?php

declare(strict_types=1);

use verbb\metrix\Metrix;
use verbb\metrix\sources;

use craft\helpers\App;
use craft\helpers\Json;

it('requires resolved credentials before a source is configured', function(string $class, array $settings, string $credential) {
    $source = new $class($settings);
    expect($source->isConfigured())->toBeTrue();
    $source->$credential = '$METRIX_AUDIT_MISSING_CREDENTIAL';
    putenv('METRIX_AUDIT_MISSING_CREDENTIAL=');
    try {
        expect($source->isConfigured())->toBeFalse()
            ->and($source->$credential)->toBe('$METRIX_AUDIT_MISSING_CREDENTIAL')
            ->and($source->getErrors())->toBe([]);
        putenv('METRIX_AUDIT_MISSING_CREDENTIAL');
        expect($source->isConfigured())->toBeFalse();
    } finally {
        putenv('METRIX_AUDIT_MISSING_CREDENTIAL');
    }
})->with([
    [sources\Plausible::class, ['apiKey' => 'key', 'siteId' => 'site'], 'apiKey'],
    [sources\Fathom::class, ['apiKey' => 'key', 'siteId' => 'site'], 'siteId'],
    [sources\MixPanel::class, ['username' => 'user', 'password' => 'secret', 'projectId' => '1'], 'password'],
    [sources\Matomo::class, ['apiUrl' => 'https://example.test', 'apiToken' => 'key', 'siteId' => '1'], 'apiToken'],
    [sources\Cloudflare::class, ['apiToken' => 'key', 'zoneId' => 'zone'], 'zoneId'],
    [sources\GoatCounter::class, ['siteUrl' => 'https://example.test', 'apiKey' => 'key'], 'apiKey'],
    [sources\SimpleAnalytics::class, ['hostname' => 'example.test'], 'hostname'],
    [sources\Pirsch::class, ['clientId' => 'client', 'clientSecret' => 'secret', 'domainId' => 'domain'], 'clientSecret'],
    [sources\Umami::class, ['websiteId' => 'site', 'apiKey' => 'key'], 'apiKey'],
    [sources\Umami::class, ['websiteId' => 'site', 'username' => 'user', 'password' => 'secret'], 'password'],
    [sources\GoogleAnalytics::class, ['clientId' => 'client', 'clientSecret' => 'secret'], 'clientSecret'],
]);

it('excludes a persisted source whose environment credential becomes empty', function() {
    $transaction = Craft::$app->getDb()->beginTransaction();
    $previousSources = Metrix::$plugin->getSources();
    Metrix::$plugin->set('sources', new \verbb\metrix\services\Sources());
    putenv('METRIX_AUDIT_SOURCE_KEY=fixture');
    try {
        $source = new sources\Plausible(['enabled' => true, 'name' => 'Configured audit source', 'handle' => 'configuredAuditSource', 'apiKey' => '$METRIX_AUDIT_SOURCE_KEY', 'siteId' => 'example.test']);
        expect(Metrix::$plugin->getSources()->saveSource($source))->toBeTrue();
        expect(array_column(Metrix::$plugin->getSources()->getAllConfiguredSources(), 'id'))->toContain($source->id);
        putenv('METRIX_AUDIT_SOURCE_KEY=');
        expect(array_column(Metrix::$plugin->getSources()->getAllConfiguredSources(), 'id'))->not->toContain($source->id);
    } finally {
        $transaction->rollBack();
        Metrix::$plugin->set('sources', $previousSources);
        putenv('METRIX_AUDIT_SOURCE_KEY');
    }
});

it('keys persisted source setting fingerprints with the Craft security key', function() {
    $source = new sources\Plausible([
        'apiKey' => 'low-entropy-test-secret',
        'siteId' => 'example.test',
    ]);
    $settings = $source->getSettings();
    array_walk_recursive($settings, static function(&$value) {
        if (is_string($value)) {
            $value = App::parseEnv($value);
        }
    });
    $payload = Json::encode([sources\Plausible::class, $settings]);
    $plainFingerprint = hash('sha256', $payload);
    $keyedFingerprint = hash_hmac(
        'sha256',
        $payload,
        (string)Craft::$app->getConfig()->getGeneral()->securityKey,
    );

    expect($source->getCacheKey())
        ->toBe($keyedFingerprint)
        ->not->toBe($plainFingerprint);
});
