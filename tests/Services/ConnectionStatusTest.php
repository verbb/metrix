<?php

declare(strict_types=1);

use GuzzleHttp\Psr7\Response;
use Tests\Support\ProviderHttp;
use verbb\metrix\Metrix;
use verbb\metrix\services\Sources;
use verbb\metrix\sources\Fathom;

it('persists failed connection checks and retries after a previous success', function() {
    $transaction = Craft::$app->getDb()->beginTransaction();
    $projectConfig = Craft::$app->getProjectConfig();
    $configVersion = Craft::$app->getInfo()->configVersion;
    $originalSources = Metrix::$plugin->getSources();
    Metrix::$plugin->set('sources', new Sources());

    try {
        $source = new Fathom(['name' => 'Connection status', 'handle' => 'connectionStatus', 'apiKey' => 'fixture', 'siteId' => 'fixture']);
        expect(Metrix::$plugin->getSources()->saveSource($source))->toBeTrue();
        $history = [];
        ProviderHttp::mock($source, [['id' => 'fixture'], new Response(401, [], '{"error":"Rejected fixture token"}')], $history);
        expect($source->checkConnection(false))->toBeTrue();
        expect(fn() => $source->checkConnection(false))->toThrow(Exception::class);

        $reloaded = (new Sources())->getSourceById($source->id);
        expect($source->isConnected())->toBeFalse()
            ->and($reloaded->isConnected())->toBeFalse();
        $retryHistory = [];
        ProviderHttp::mock($reloaded, [['id' => 'fixture']], $retryHistory);
        expect($reloaded->checkConnection())->toBeTrue()
            ->and($retryHistory)->toHaveCount(1)
            ->and((new Sources())->getSourceById($source->id)->isConnected())->toBeTrue();
    } finally {
        $projectConfig->saveModifiedConfigData();
        $transaction->rollBack();
        $projectConfig->reset();
        Craft::$app->getInfo()->configVersion = $configVersion;
        Metrix::$plugin->set('sources', $originalSources);
    }
});

it('clears a previous connection success when a provider returns false', function() {
    $source = new class extends Fathom {
        protected bool $_result = true;

        public function rejectConnection(): void
        {
            $this->_result = false;
        }

        public function fetchConnection(): bool
        {
            return $this->_result;
        }
    };
    expect($source->checkConnection(false))->toBeTrue();
    $source->rejectConnection();
    expect($source->checkConnection(false))->toBeFalse()
        ->and($source->isConnected())->toBeFalse();
});
