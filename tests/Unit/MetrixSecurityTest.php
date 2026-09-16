<?php

declare(strict_types=1);

use Tests\Support\AdminUser;
use Tests\Support\NonAdminUser;
use verbb\metrix\Metrix;
use verbb\metrix\helpers\DashboardPermissions;
use verbb\metrix\helpers\Options;
use verbb\metrix\models\AnalyticsScope;
use verbb\metrix\sources\GoogleAnalytics;
use verbb\metrix\sources\Matomo;
use verbb\metrix\sources\Plausible;
use yii\web\ForbiddenHttpException;

describe('DashboardPermissions', function() {
    it('denies dashboard access for users without metrix-dashboard', function() {
        NonAdminUser::login();

        expect(fn() => DashboardPermissions::requireDashboardAccess())
            ->toThrow(ForbiddenHttpException::class);
    });

    it('allows admins that receive metrix-dashboard via admin bypass or permission', function() {
        $admin = AdminUser::login();

        expect($admin->admin)->toBeTrue()
            ->and(fn() => DashboardPermissions::requireDashboardAccess())->not->toThrow(ForbiddenHttpException::class);
    });

    it('denies view access when the view is missing', function() {
        AdminUser::login();

        expect(fn() => DashboardPermissions::requireViewAccess(null))
            ->toThrow(ForbiddenHttpException::class);
    });
});

describe('Widgets allowlist', function() {
    it('rejects empty and unknown widget types', function() {
        expect(Metrix::$plugin->getWidgets()->isAllowedWidgetType(''))->toBeFalse();
        expect(Metrix::$plugin->getWidgets()->isAllowedWidgetType('TotallyFake\\Widget'))->toBeFalse();
        expect(Metrix::$plugin->getWidgets()->isAllowedWidgetType(null))->toBeFalse();
    });

    it('accepts registered enabled widget types from settings', function() {
        $enabled = Metrix::$plugin->getSettings()->getEnabledWidgetTypes();
        expect($enabled)->not->toBeEmpty();
        expect(Metrix::$plugin->getWidgets()->isAllowedWidgetType($enabled[0]))->toBeTrue();
    });
});

describe('Dashboard view selection', function() {
    it('accepts only view handles present in the permitted options', function() {
        $options = [
            ['label' => 'Default', 'value' => 'default'],
            ['label' => 'Marketing', 'value' => 'marketing'],
        ];

        expect(Options::resolveViewHandle('marketing', $options))->toBe('marketing');
        expect(Options::resolveViewHandle('removed-view', $options))->toBe('default');
        expect(Options::resolveViewHandle(null, $options))->toBe('default');
        expect(Options::resolveViewHandle('anything', []))->toBeNull();
    });
});

describe('Plausible analytics scope', function() {
    it('maps begins_with to an anchored matches filter', function() {
        $scope = new AnalyticsScope([
            'mode' => 'path',
            'pathPrefix' => '/docs/v1.0+',
            'match' => AnalyticsScope::MATCH_BEGINS_WITH,
        ]);

        $plausible = (new ReflectionClass(Plausible::class))->newInstanceWithoutConstructor();
        $request = [];
        $plausible->applyAnalyticsScope($request, $scope);

        expect($request['filters'])->toBe([
            ['matches', 'event:page', ['^\\/docs\\/v1\\.0\\+']],
        ]);
    });

    it('preserves existing filters and maps exact and contains explicitly', function(string $match, array $expected) {
        $scope = new AnalyticsScope([
            'mode' => AnalyticsScope::MODE_PATH,
            'pathPrefix' => '/docs',
            'match' => $match,
        ]);
        $plausible = (new ReflectionClass(Plausible::class))->newInstanceWithoutConstructor();
        $request = ['filters' => [['is', 'visit:source', ['newsletter']]]];
        $plausible->applyAnalyticsScope($request, $scope);

        expect($request['filters'])->toBe([
            ['is', 'visit:source', ['newsletter']],
            $expected,
        ]);
    })->with([
        'exact' => [AnalyticsScope::MATCH_EXACT, ['is', 'event:page', ['/docs']]],
        'contains' => [AnalyticsScope::MATCH_CONTAINS, ['contains', 'event:page', ['/docs']]],
    ]);
});

describe('Cross-provider analytics scope contract', function() {
    it('maps the same path intent to Google Analytics and Matomo request shapes', function() {
        $scope = new AnalyticsScope([
            'mode' => AnalyticsScope::MODE_PATH,
            'pathPrefix' => 'docs',
            'match' => AnalyticsScope::MATCH_BEGINS_WITH,
        ]);
        $google = (new ReflectionClass(GoogleAnalytics::class))->newInstanceWithoutConstructor();
        $googleRequest = ['dimensionFilter' => [
            'filter' => ['fieldName' => 'country', 'stringFilter' => ['matchType' => 'EXACT', 'value' => 'AU']],
        ]];
        $google->applyAnalyticsScope($googleRequest, $scope);
        $matomo = (new ReflectionClass(Matomo::class))->newInstanceWithoutConstructor();
        $matomoRequest = ['segment' => 'countryCode==AU'];
        $matomo->applyAnalyticsScope($matomoRequest, $scope);

        expect($googleRequest['dimensionFilter'])->toBe([
            'andGroup' => ['expressions' => [
                [
                    'filter' => [
                        'fieldName' => 'pagePath',
                        'stringFilter' => ['matchType' => 'BEGINS_WITH', 'value' => '/docs'],
                    ],
                ],
                [
                    'filter' => [
                        'fieldName' => 'country',
                        'stringFilter' => ['matchType' => 'EXACT', 'value' => 'AU'],
                    ],
                ],
            ]],
        ])->and($matomoRequest['segment'])->toBe('countryCode==AU;pageUrl=^/docs');
    });

    it('rejects invalid scope modes and match operators at the model boundary', function() {
        $scope = new AnalyticsScope(['mode' => 'arbitrary', 'match' => 'regex']);

        expect($scope->validate())->toBeFalse()
            ->and($scope->getErrors())->toHaveKeys(['mode', 'match']);
    });
});

describe('AuthController anonymous surface', function() {
    it('only allows the OAuth callback anonymously', function() {
        $controller = (new ReflectionClass(\verbb\metrix\controllers\AuthController::class))->newInstanceWithoutConstructor();
        $prop = new ReflectionProperty(\verbb\metrix\controllers\AuthController::class, 'allowAnonymous');
        $prop->setAccessible(true);

        expect($prop->getValue($controller))->toBe(['callback']);
    });
});
