<?php

declare(strict_types=1);

use ReflectionClass;
use ReflectionProperty;
use Tests\Support\AdminUser;
use Tests\Support\NonAdminUser;
use verbb\metrix\Metrix;
use verbb\metrix\helpers\DashboardPermissions;
use verbb\metrix\models\AnalyticsScope;
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

        // Admins typically pass Craft permission checks; requireDashboardAccess should not throw.
        if ($admin->can('metrix-dashboard') || $admin->admin) {
            expect(fn() => DashboardPermissions::requireDashboardAccess())->not->toThrow(ForbiddenHttpException::class);
        } else {
            $this->markTestSkipped('Admin could not access metrix-dashboard in this install.');
        }
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

describe('Plausible analytics scope', function() {
    it('maps begins_with to an anchored matches filter', function() {
        $scope = new AnalyticsScope([
            'mode' => 'path',
            'pathPrefix' => '/docs',
            'match' => AnalyticsScope::MATCH_BEGINS_WITH,
        ]);

        $plausible = (new ReflectionClass(Plausible::class))->newInstanceWithoutConstructor();
        $request = [];
        $plausible->applyAnalyticsScope($request, $scope);

        $filter = $request['filters'][0] ?? null;
        expect($filter[0] ?? null)->toBe('matches');
        expect((string)($filter[2][0] ?? ''))->toStartWith('^');
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
