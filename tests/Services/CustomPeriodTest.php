<?php

declare(strict_types=1);

use craft\events\RegisterComponentTypesEvent;
use verbb\auth\exceptions\OAuthTokenRefreshException;
use verbb\metrix\Metrix;
use verbb\metrix\base\Source;
use verbb\metrix\controllers\DashboardController;
use verbb\metrix\models\Settings;
use verbb\metrix\periods\LastWeek;
use verbb\metrix\services\Periods;
use verbb\metrix\widgets\Counter;

use yii\web\BadRequestHttpException;

it('offers registered custom periods in the default settings and grouped picker', function() {
    $custom = new class extends LastWeek {};
    $service = new Periods();
    $service->on(Periods::EVENT_REGISTER_PERIOD_TYPES, function(RegisterComponentTypesEvent $event) use ($custom) {
        $event->types[] = $custom::class;
    });
    $original = Metrix::$plugin->getPeriods();
    Metrix::$plugin->set('periods', $service);
    try {
        expect(array_merge(...$service->getGroupedPeriodTypes()))->toContain($custom::class);
        expect($service->isRegisteredPeriodType($custom::class))->toBeTrue();
        expect(array_column((new Settings())->getPeriodSettingsRows(), 'id'))->toContain($custom::class);
    } finally {
        Metrix::$plugin->set('periods', $original);
    }
});

it('accepts only registered dashboard period classes', function() {
    $request = Craft::$app->getRequest();
    $queryParams = $request->getQueryParams();
    $bodyParams = $request->getBodyParams();
    $controller = new DashboardController('dashboard', Metrix::$plugin);
    $method = new ReflectionMethod($controller, '_getGlobalPeriodFromRequest');

    try {
        $request->setQueryParams(['globalPeriod' => LastWeek::class]);
        $request->setBodyParams([]);
        expect($method->invoke($controller))->toBe(LastWeek::class);

        $request->setQueryParams(['globalPeriod' => 'invalid_grant']);
        expect(fn() => $method->invoke($controller))->toThrow(BadRequestHttpException::class);
    } finally {
        $request->setQueryParams($queryParams);
        $request->setBodyParams($bodyParams);
    }
});

it('rejects unregistered saved widget periods', function() {
    $widget = new Counter(['period' => 'invalid_grant']);

    expect($widget->validate(['period']))->toBeFalse()
        ->and($widget->getErrors('period'))->not->toBeEmpty()
        ->and($widget->getResolvedPeriod())->toBeNull();
});

it('only treats typed OAuth refresh failures as reconnect failures', function() {
    expect(Source::isOAuthReconnectFailure(new RuntimeException('invalid_grant')))->toBeFalse()
        ->and(Source::isOAuthReconnectFailure(new RuntimeException(
            'Wrapped refresh failure',
            0,
            new OAuthTokenRefreshException('Reconnect required'),
        )))->toBeTrue();
});
