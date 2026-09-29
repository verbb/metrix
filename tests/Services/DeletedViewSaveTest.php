<?php

declare(strict_types=1);

use Tests\Support\AdminUser;
use Tests\Support\CpRequestContext;
use verbb\metrix\Metrix;
use verbb\metrix\controllers\ViewsController;
use verbb\metrix\models\View;
use verbb\metrix\services\Views;
use yii\web\NotFoundHttpException;

it('rejects a stale edit form after its view is deleted without creating a replacement', function() {
    $transaction = Craft::$app->getDb()->beginTransaction();
    $projectConfig = Craft::$app->getProjectConfig();
    $configVersion = Craft::$app->getInfo()->configVersion;
    $originalViews = Metrix::$plugin->getViews();
    Metrix::$plugin->set('views', $views = new Views());

    try {
        $view = new View(['name' => 'Deleted edit', 'handle' => 'deletedEdit']);
        expect($views->saveView($view))->toBeTrue();
        $id = $view->id;
        expect($views->deleteView($view))->toBeTrue();
        CpRequestContext::activate('actions/metrix/views/save');
        AdminUser::login();
        Craft::$app->getRequest()->getHeaders()->set('Accept', 'text/html');
        Craft::$app->getRequest()->setBodyParams([
            'id' => $id,
            'name' => 'Deleted edit',
            'handle' => 'deletedEdit',
            'redirect' => Craft::$app->getSecurity()->hashData('metrix/views'),
        ]);

        $controller = new ViewsController('views', Metrix::$plugin);
        $error = null;
        try {
            $controller->actionSave();
        } catch (NotFoundHttpException $exception) {
            $error = $exception;
        }
        expect((new Views())->getViewByHandle('deletedEdit'))->toBeNull()
            ->and($error)->toBeInstanceOf(NotFoundHttpException::class);
    } finally {
        $projectConfig->saveModifiedConfigData();
        $transaction->rollBack();
        $projectConfig->reset();
        Craft::$app->getInfo()->configVersion = $configVersion;
        Metrix::$plugin->set('views', $originalViews);
    }
});
