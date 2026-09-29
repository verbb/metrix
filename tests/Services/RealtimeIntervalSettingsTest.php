<?php

declare(strict_types=1);

use verbb\metrix\models\Settings;

it('rejects refresh intervals that cannot produce a usable browser timer', function($value) {
    $settings = new Settings(['realtimeInterval' => $value]);
    expect($settings->validate(['realtimeInterval']))->toBeFalse();
    expect($settings->getErrors('realtimeInterval'))->not->toBeEmpty();
})->with([0, -1, '', 'abc', '1.5', null, 2147484]);

it('converts supported refresh intervals to milliseconds', function($value, int $milliseconds) {
    $settings = new Settings(['realtimeInterval' => $value]);
    expect($settings->validate(['realtimeInterval']))->toBeTrue();
    expect($settings->getRealtimeInterval())->toBe($milliseconds);
})->with([[1, 1000], ['20', 20000], [2147483, 2147483000]]);

it('rejects an invalid environment interval before it reaches the browser', function() {
    $settings = new Settings(['realtimeInterval' => 0]);
    expect(fn() => $settings->getRealtimeInterval())->toThrow(\yii\base\InvalidConfigException::class);
});

it('returns the invalid refresh interval to the settings form without saving', function() {
    $plugin = \verbb\metrix\Metrix::$plugin;
    $settings = $plugin->getSettings();
    $original = $settings->toArray();
    try {
        \Tests\Support\CpRequestContext::activate('actions/metrix/settings/save-settings');
        \Tests\Support\AdminUser::login();
        Craft::$app->getRequest()->setBodyParams(['settings' => ['realtimeInterval' => 'abc']]);
        $response = (new \verbb\metrix\controllers\SettingsController('settings', $plugin))->actionSaveSettings();
        expect($response)->toBeNull();
        expect($settings->realtimeInterval)->toBe('abc');
        expect($settings->getErrors('realtimeInterval'))->not->toBeEmpty();
    } finally {
        $plugin->setSettings($original);
        $settings->clearErrors();
    }
});
