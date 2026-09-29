<?php

declare(strict_types=1);

use verbb\metrix\services\Sources;
use verbb\metrix\sources\Plausible;

it('keeps configured sources usable when an enabled provider class is unavailable', function() {
    $transaction = Craft::$app->getDb()->beginTransaction();
    try {
        $sources = new Sources();
        $source = new Plausible(['name' => 'Missing custom provider', 'handle' => 'missingCustomProvider', 'enabled' => true, 'apiKey' => 'fixture', 'siteId' => 'example.test']);
        expect($sources->saveSource($source))->toBeTrue();
        Craft::$app->getDb()->createCommand()->update('{{%metrix_sources}}', ['type' => 'modules\\unavailable\\Provider'], ['id' => $source->id])->execute();
        $sources = new Sources();
        expect($sources->getSourceById($source->id)->isConfigured())->toBeFalse();
        expect(array_column($sources->getAllConfiguredSources(), 'id'))->not->toContain($source->id);
    } finally {
        $transaction->rollBack();
    }
});
