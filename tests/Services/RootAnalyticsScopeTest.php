<?php

declare(strict_types=1);

use verbb\metrix\models\AnalyticsScope;
use verbb\metrix\models\View;
use verbb\metrix\services\Views;
use verbb\metrix\sources\Plausible;

it('preserves an exact homepage scope through persistence and provider filtering', function() {
    $transaction = Craft::$app->getDb()->beginTransaction();

    try {
        $view = new View(['name' => 'Homepage scope', 'handle' => 'homepageScope']);
        $view->setAnalyticsScope(['mode' => 'path', 'pathPrefix' => '/', 'match' => 'exact']);
        expect((new Views())->saveView($view))->toBeTrue();
        $scope = (new Views())->getViewById($view->id)->getAnalyticsScope();
        $request = [];
        (new Plausible())->applyAnalyticsScope($request, $scope);

        expect($scope->isActive())->toBeTrue()
            ->and($scope->getResolvedPathPrefix())->toBe('/')
            ->and($scope->cacheKey())->not->toBe('scope:none')
            ->and(json_encode($request))->toContain('event:page', 'is', '\/');
    } finally {
        $transaction->rollBack();
    }
});

it('keeps root prefix matching unfiltered', function() {
    $scope = new AnalyticsScope(['mode' => 'path', 'pathPrefix' => '/', 'match' => 'begins_with']);
    expect($scope->isActive())->toBeFalse()->and($scope->toConfig()['pathPrefix'])->toBeNull();
});
