<?php

declare(strict_types=1);

use craft\elements\User;
use craft\services\UserPermissions;
use Tests\Support\CpRequestContext;
use verbb\metrix\Metrix;
use verbb\metrix\controllers\DashboardController;
use verbb\metrix\helpers\DashboardPermissions;
use verbb\metrix\models\View;
use verbb\metrix\services\Sources;
use verbb\metrix\services\Views;
use verbb\metrix\services\Widgets;
use verbb\metrix\sources\Plausible;
use verbb\metrix\widgets\Counter;
use yii\web\BadRequestHttpException;
use yii\web\ForbiddenHttpException;

beforeEach(function() {
    $this->permissionsTransaction = Craft::$app->getDb()->beginTransaction();
    $this->permissionsServices = [];
    foreach (['sources' => Sources::class, 'views' => Views::class, 'widgets' => Widgets::class] as $key => $class) {
        $this->permissionsServices[$key] = Metrix::$plugin->get($key);
        Metrix::$plugin->set($key, new $class());
    }
    $this->previousPermissions = Craft::$app->getUserPermissions();
    Craft::$app->set('userPermissions', new UserPermissions());
    $suffix = bin2hex(random_bytes(5));
    $this->permittedView = new View(['name' => 'Allowed ' . $suffix, 'handle' => 'allowed' . $suffix]);
    $this->restrictedView = new View(['name' => 'Restricted ' . $suffix, 'handle' => 'restricted' . $suffix]);
    Metrix::$plugin->getViews()->saveView($this->permittedView);
    Metrix::$plugin->getViews()->saveView($this->restrictedView);
    $source = new Plausible(['name' => 'Source ' . $suffix, 'handle' => 'source' . $suffix, 'apiKey' => 'fixture', 'siteId' => 'fixture.invalid']);
    Metrix::$plugin->getSources()->saveSource($source);
    $this->restrictedWidget = new Counter(['metric' => 'pageviews', 'width' => 1]);
    $this->restrictedWidget->setSource($source);
    $this->restrictedWidget->setView($this->restrictedView);
    Metrix::$plugin->getWidgets()->saveWidget($this->restrictedWidget);
    $this->editor = new User(['username' => 'editor' . $suffix, 'email' => 'editor' . $suffix . '@example.test', 'admin' => false]);
    expect(Craft::$app->getElements()->saveElement($this->editor, false))->toBeTrue();
    Craft::$app->getUserPermissions()->saveUserPermissions($this->editor->id, [
        'accessCp', 'accessPlugin-metrix', 'metrix-dashboard', 'metrix-dashboard:' . $this->permittedView->uid,
    ]);
    CpRequestContext::activate('actions/metrix/dashboard/widgets', 'POST');
    Craft::$app->getUser()->setIdentity($this->editor);
    Craft::$app->getRequest()->getHeaders()->set('Accept', 'application/json');
});

afterEach(function() {
    $this->permissionsTransaction->rollBack();
    Craft::$app->set('userPermissions', $this->previousPermissions);
    foreach ($this->permissionsServices as $key => $service) {
        Metrix::$plugin->set($key, $service);
    }
});

it('uses persisted permissions to limit the available views', function() {
    expect($this->editor->can('metrix-dashboard'))->toBeTrue()
        ->and($this->editor->can('metrix-dashboard:' . $this->restrictedView->uid))->toBeFalse();
    DashboardPermissions::requireViewAccess($this->permittedView);
    expect(array_column(Metrix::$plugin->getViews()->getAllViewableViews(), 'id'))->toBe([$this->permittedView->id]);
    expect(fn() => DashboardPermissions::requireViewAccess($this->restrictedView))->toThrow(ForbiddenHttpException::class);
});

it('rejects direct mutations to a widget in another view', function(string $action, array $parameters) {
    $parameters['id'] = $this->restrictedWidget->id;
    $parameters['ids'] = [$this->restrictedWidget->id];
    Craft::$app->getRequest()->setBodyParams($parameters);
    $controller = new DashboardController('dashboard', Metrix::$plugin);
    $controller->enableCsrfValidation = false;

    expect(fn() => $controller->runAction($action))->toThrow(ForbiddenHttpException::class);
    expect(Metrix::$plugin->getWidgets()->getWidgetById($this->restrictedWidget->id))->not->toBeNull();
})->with([
    ['delete-widget', []],
    ['duplicate-widget', []],
    ['save-widget-order', []],
    ['save-widget', ['widget' => ['title' => 'Unauthorized change']]],
]);

it('rejects an authenticated mutation without its CSRF token', function() {
    Craft::$app->getRequest()->setBodyParams(['view' => $this->permittedView->handle]);
    $controller = new DashboardController('dashboard', Metrix::$plugin);

    expect(fn() => $controller->runAction('widgets'))->toThrow(BadRequestHttpException::class, 'Unable to verify your data submission');
});
