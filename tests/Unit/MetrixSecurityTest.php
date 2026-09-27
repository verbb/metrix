<?php

declare(strict_types=1);

use Tests\Support\AdminUser;
use Tests\Support\CpRequestContext;
use Tests\Support\NonAdminUser;
use Tests\Support\ProviderHttp;
use verbb\metrix\base\CredentialsSource;
use verbb\metrix\Metrix;
use verbb\metrix\controllers\AuthController;
use verbb\metrix\helpers\DashboardPermissions;
use verbb\metrix\helpers\Options;
use verbb\metrix\helpers\ProviderUrl;
use verbb\metrix\helpers\SourceSecurity;
use verbb\metrix\models\AnalyticsScope;
use verbb\metrix\sources\GoatCounter;
use verbb\metrix\sources\GoogleAnalytics;
use verbb\metrix\sources\Matomo;
use verbb\metrix\sources\Plausible;
use yii\base\InvalidArgumentException;
use yii\web\BadRequestHttpException;
use yii\web\ForbiddenHttpException;
use yii\web\MethodNotAllowedHttpException;

use GuzzleHttp\Client;

describe('OAuth callback transactions', function() {
    it('rejects an unknown transaction before processing the provider callback', function() {
        CpRequestContext::activate('actions/metrix/auth/callback', 'GET', false);
        Craft::$app->getRequest()->setQueryParams([
            'state' => 'invalid-oauth-state-' . uniqid(),
            'code' => 'unused-authorization-code',
        ]);

        $controller = new AuthController('auth', Metrix::$plugin);

        expect(fn() => $controller->runAction('callback'))
            ->toThrow(BadRequestHttpException::class, 'invalid or has expired');
    });
});

describe('OAuth management access', function() {
    it('requires POST for an authorized management request', function(string $action) {
        AdminUser::login();
        CpRequestContext::activate("actions/metrix/auth/{$action}", 'GET', true);

        $controller = new AuthController('auth', Metrix::$plugin);

        expect(fn() => $controller->runAction($action))
            ->toThrow(MethodNotAllowedHttpException::class);
    })->with(['connect', 'disconnect']);

    it('requires source-management permission', function(string $action) {
        NonAdminUser::login();
        CpRequestContext::activate("actions/metrix/auth/{$action}", 'POST', true);

        $controller = new AuthController('auth', Metrix::$plugin);
        $controller->enableCsrfValidation = false;

        expect(fn() => $controller->runAction($action))
            ->toThrow(ForbiddenHttpException::class);
    })->with(['connect', 'disconnect']);
});

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

describe('Provider URL security', function() {
    beforeEach(function() {
        $this->allowedPrivateProviderHosts = Metrix::$plugin->getSettings()->allowedPrivateProviderHosts;
    });

    afterEach(function() {
        ProviderUrl::setResolver(null);
        Metrix::$plugin->getSettings()->allowedPrivateProviderHosts = $this->allowedPrivateProviderHosts;
    });

    it('rejects private, mixed public-private, metadata, and credential-bearing destinations', function(string $url, array $ips) {
        ProviderUrl::setResolver(static fn() => $ips);

        expect(fn() => ProviderUrl::requestOptions($url))
            ->toThrow(InvalidArgumentException::class);
    })->with([
        'private IPv4' => ['https://analytics.example.test', ['10.0.0.5']],
        'mixed DNS answers' => ['https://analytics.example.test', ['93.184.216.34', '127.0.0.1']],
        'metadata hostname' => ['http://metadata.google.internal', ['93.184.216.34']],
        'URL userinfo' => ['https://token@analytics.example.test', ['93.184.216.34']],
    ]);

    it('pins public destinations and disables redirects', function() {
        ProviderUrl::setResolver(static fn() => ['93.184.216.34']);
        $options = ProviderUrl::requestOptions('https://analytics.example.test');

        expect($options['allow_redirects'])->toBeFalse();

        if (defined('CURLOPT_RESOLVE')) {
            expect($options['curl'][CURLOPT_RESOLVE][0])->toContain('analytics.example.test:443:93.184.216.34');
        }
    });

    it('preserves explicitly approved private self-hosted destinations', function() {
        Metrix::$plugin->getSettings()->allowedPrivateProviderHosts = ['analytics.internal.example'];
        ProviderUrl::setResolver(static fn() => ['10.0.0.5']);

        expect(fn() => ProviderUrl::requestOptions('https://analytics.internal.example'))
            ->not->toThrow(InvalidArgumentException::class);
    });

    it('removes a configured proxy from credential-bearing requests', function() {
        $source = new GoatCounter(['siteUrl' => 'https://fixture.invalid', 'apiKey' => 'fixture']);
        $history = [];
        ProviderHttp::mock($source, [['ok' => true]], $history);
        $clientProperty = new ReflectionProperty(CredentialsSource::class, '_client');
        $config = $clientProperty->getValue($source)->getConfig();
        $config['proxy'] = 'http://proxy.example.test:8080';
        $clientProperty->setValue($source, new Client($config));

        $source->request('GET', 'api/v0/me');

        expect($history[0]['options'])->not->toHaveKey('proxy');
    });
});

describe('Delegated Source settings', function() {
    it('rejects new environment and alias references in every Craft-supported form', function(string $value) {
        $source = new GoatCounter(['siteUrl' => 'https://analytics.example.test', 'apiKey' => $value]);

        expect(SourceSecurity::validateDelegatedChange($source))->toBeFalse()
            ->and($source->getErrors('apiKey'))->not->toBeEmpty();
    })->with(['$METRIX_KEY', '${METRIX_KEY}', 'prefix/${METRIX_KEY}', '@secretAlias']);

    it('allows ordinary settings changes while preserving administrator-owned references', function() {
        $original = new Matomo([
            'apiUrl' => 'https://analytics.example.test',
            'apiToken' => '$MATOMO_TOKEN',
            'siteId' => '1',
        ]);
        $changed = clone $original;
        $changed->siteId = '2';

        expect(SourceSecurity::validateDelegatedChange($changed, $original))->toBeTrue();
    });

    it('rejects destination changes while an environment-backed secret remains attached', function() {
        $original = new Matomo([
            'apiUrl' => 'https://analytics.example.test',
            'apiToken' => '$MATOMO_TOKEN',
            'siteId' => '1',
        ]);
        $changed = clone $original;
        $changed->apiUrl = 'https://attacker.example.test';

        expect(SourceSecurity::validateDelegatedChange($changed, $original))->toBeFalse()
            ->and($changed->getErrors('apiUrl'))->not->toBeEmpty();
    });
});

describe('Dashboard request bounds', function() {
    it('strictly validates and stably deduplicates widget IDs', function() {
        $controller = (new ReflectionClass(\verbb\metrix\controllers\DashboardController::class))->newInstanceWithoutConstructor();
        $method = new ReflectionMethod($controller, '_normalizeWidgetIds');

        expect($method->invoke($controller, [2, '1', 2]))->toBe([2, 1]);
    });

    it('rejects coerced or non-positive widget IDs', function(mixed $id) {
        $controller = (new ReflectionClass(\verbb\metrix\controllers\DashboardController::class))->newInstanceWithoutConstructor();
        $method = new ReflectionMethod($controller, '_normalizeWidgetIds');

        expect(fn() => $method->invoke($controller, [$id]))
            ->toThrow(\yii\web\BadRequestHttpException::class);
    })->with([
        'zero' => [0],
        'negative' => [-1],
        'float' => [1.5],
        'boolean' => [true],
        'numeric junk' => ['1x'],
        'array' => [[]],
    ]);
});
