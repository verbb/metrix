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
    $this->source = new Plausible(['name' => 'Source ' . $suffix, 'handle' => 'source' . $suffix, 'apiKey' => 'fixture', 'siteId' => 'fixture.invalid']);
    Metrix::$plugin->getSources()->saveSource($this->source);
    $this->permittedWidget = new Counter(['metric' => 'pageviews', 'width' => 1]);
    $this->permittedWidget->setSource($this->source);
    $this->permittedWidget->setView($this->permittedView);
    Metrix::$plugin->getWidgets()->saveWidget($this->permittedWidget);
    $this->restrictedWidget = new Counter(['metric' => 'pageviews', 'width' => 1]);
    $this->restrictedWidget->setSource($this->source);
    $this->restrictedWidget->setView($this->restrictedView);
    Metrix::$plugin->getWidgets()->saveWidget($this->restrictedWidget);
    $this->editor = new User(['username' => 'editor' . $suffix, 'email' => 'editor' . $suffix . '@example.test', 'admin' => false]);
    expect(Craft::$app->getElements()->saveElement($this->editor, false))->toBeTrue();
    Craft::$app->getUserPermissions()->saveUserPermissions($this->editor->id, [
        'accessCp', 'accessPlugin-metrix', 'metrix-dashboard', 'metrix-dashboard:' . $this->permittedView->uid,
    ]);
    $this->layoutManager = new User(['username' => 'manager' . $suffix, 'email' => 'manager' . $suffix . '@example.test', 'admin' => false]);
    expect(Craft::$app->getElements()->saveElement($this->layoutManager, false))->toBeTrue();
    Craft::$app->getUserPermissions()->saveUserPermissions($this->layoutManager->id, [
        'accessCp', 'accessPlugin-metrix', 'metrix-dashboard', 'metrix-views', 'metrix-dashboard:' . $this->permittedView->uid,
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
    Craft::$app->getUser()->setIdentity($this->layoutManager);
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

it('rejects layout changes from users who can only view the dashboard', function(string $action) {
    $parameters = match ($action) {
        'save-widget' => ['id' => $this->permittedWidget->id, 'widget' => ['title' => 'Unauthorized change']],
        'save-widget-order' => ['ids' => [$this->permittedWidget->id]],
        'delete-widget', 'duplicate-widget' => ['id' => $this->permittedWidget->id],
        'apply-preset' => ['view' => $this->permittedView->handle, 'preset' => 'does-not-matter'],
        'property-options' => ['source' => $this->source->handle, 'property' => 'metrics'],
    };
    Craft::$app->getRequest()->setBodyParams($parameters);
    $controller = new DashboardController('dashboard', Metrix::$plugin);
    $controller->enableCsrfValidation = false;

    expect(fn() => $controller->runAction($action))
        ->toThrow(ForbiddenHttpException::class, 'manage dashboard layouts');
})->with(['save-widget', 'save-widget-order', 'delete-widget', 'duplicate-widget', 'apply-preset', 'property-options']);

it('does not let a view-only user create a widget with an arbitrary configured source', function() {
    Craft::$app->getRequest()->setBodyParams(['widget' => [
        'type' => Counter::class,
        'source' => $this->source->handle,
        'view' => $this->permittedView->handle,
        'metric' => 'pageviews',
        'width' => 1,
    ]]);
    $controller = new DashboardController('dashboard', Metrix::$plugin);
    $controller->enableCsrfValidation = false;

    expect(fn() => $controller->runAction('save-widget'))
        ->toThrow(ForbiddenHttpException::class, 'manage dashboard layouts');
    expect(Metrix::$plugin->getWidgets()->getWidgetsForView($this->permittedView->handle))->toHaveCount(1);
});

it('keeps widget reads available to view-only users', function() {
    Craft::$app->getRequest()->setBodyParams(['view' => $this->permittedView->handle]);
    $controller = new DashboardController('dashboard', Metrix::$plugin);
    $controller->enableCsrfValidation = false;
    $response = $controller->runAction('widgets');

    expect($response->data)->toHaveCount(1);
});

it('allows a view layout manager to update an accessible widget', function() {
    Craft::$app->getUser()->setIdentity($this->layoutManager);
    Craft::$app->getRequest()->setBodyParams([
        'id' => $this->permittedWidget->id,
        'widget' => ['title' => 'Managed title'],
    ]);
    $controller = new DashboardController('dashboard', Metrix::$plugin);
    $controller->enableCsrfValidation = false;
    $controller->runAction('save-widget');

    expect(Metrix::$plugin->getWidgets()->getWidgetById($this->permittedWidget->id)->title)->toBe('Managed title');
});

it('rejects an authenticated mutation without its CSRF token', function() {
    Craft::$app->getRequest()->setBodyParams(['view' => $this->permittedView->handle]);
    $controller = new DashboardController('dashboard', Metrix::$plugin);

    expect(fn() => $controller->runAction('widgets'))->toThrow(BadRequestHttpException::class, 'Unable to verify your data submission');
});

it('returns a recoverable error for a missing or unknown widget source', function(?string $source) {
    Craft::$app->getUser()->setIdentity($this->layoutManager);
    $widget = ['type' => Counter::class, 'view' => $this->permittedView->handle, 'metric' => 'pageviews', 'width' => 1];
    if ($source !== null) {
        $widget['source'] = $source;
    }
    Craft::$app->getRequest()->setBodyParams(['widget' => $widget]);
    $controller = new DashboardController('dashboard', Metrix::$plugin);
    $controller->enableCsrfValidation = false;
    $response = $controller->runAction('save-widget');

    expect($response->statusCode)->toBe(400)->and($response->data['message'])->toContain('source');
})->with([null, '', 'unknownSource']);

it('checks view access before saving a new widget without a view', function() {
    Craft::$app->getUser()->setIdentity($this->layoutManager);
    Craft::$app->getRequest()->setBodyParams(['widget' => [
        'type' => Counter::class, 'source' => $this->restrictedWidget->getSource()->handle, 'metric' => 'pageviews', 'width' => 1,
    ]]);
    $controller = new DashboardController('dashboard', Metrix::$plugin);
    $controller->enableCsrfValidation = false;

    expect(fn() => $controller->runAction('save-widget'))->toThrow(ForbiddenHttpException::class);
});
