<?php

declare(strict_types=1);

use Tests\Support\AdminUser;
use Tests\Support\CpRequestContext;
use Tests\Support\NonAdminUser;
use verbb\metrix\Metrix;
use verbb\metrix\controllers\PresetsController;
use verbb\metrix\controllers\SettingsController;
use verbb\metrix\controllers\SourcesController;
use verbb\metrix\controllers\ViewsController;
use yii\web\ForbiddenHttpException;

describe('Metrix plugin boot', function() {
    it('installs and exposes the plugin instance', function() {
        expect(Metrix::$plugin)->not->toBeNull();
        expect(Craft::$app->plugins->isPluginEnabled('metrix'))->toBeTrue();
    });
});

describe('CP permission gates', function() {
    it('SourcesController requires metrix-sources', function() {
        NonAdminUser::login();
        CpRequestContext::activate('metrix/sources', 'GET');

        $controller = new SourcesController('sources', Metrix::$plugin);
        $controller->enableCsrfValidation = false;
        $action = $controller->createAction('index');

        expect(fn() => $controller->beforeAction($action))
            ->toThrow(ForbiddenHttpException::class);
    });

    it('ViewsController requires metrix-views', function() {
        NonAdminUser::login();
        CpRequestContext::activate('metrix/views', 'GET');

        $controller = new ViewsController('views', Metrix::$plugin);
        $controller->enableCsrfValidation = false;
        $action = $controller->createAction('index');

        expect(fn() => $controller->beforeAction($action))
            ->toThrow(ForbiddenHttpException::class);
    });

    it('PresetsController requires admin', function() {
        NonAdminUser::login();
        CpRequestContext::activate('metrix/presets', 'GET');

        $controller = new PresetsController('presets', Metrix::$plugin);
        $controller->enableCsrfValidation = false;
        $action = $controller->createAction('index');

        expect(fn() => $controller->beforeAction($action))
            ->toThrow(ForbiddenHttpException::class);
    });

    it('SettingsController requires admin', function() {
        NonAdminUser::login();
        CpRequestContext::activate('metrix/settings', 'GET');

        $controller = new SettingsController('settings', Metrix::$plugin);
        $controller->enableCsrfValidation = false;
        $action = $controller->createAction('index');

        expect(fn() => $controller->beforeAction($action))
            ->toThrow(ForbiddenHttpException::class);
    });

    it('allows admins through SourcesController beforeAction', function() {
        AdminUser::login();
        CpRequestContext::activate('metrix/sources', 'GET');

        $controller = new SourcesController('sources', Metrix::$plugin);
        $controller->enableCsrfValidation = false;
        $action = $controller->createAction('index');

        expect($controller->beforeAction($action))->toBeTrue();
    });
});
