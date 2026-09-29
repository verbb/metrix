<?php

declare(strict_types=1);

use Tests\Support\AdminUser;
use Tests\Support\CpRequestContext;
use verbb\metrix\Metrix;
use verbb\metrix\controllers\SourcesController;
use verbb\metrix\controllers\ViewsController;
use verbb\metrix\models\View;
use verbb\metrix\services\Sources;
use verbb\metrix\services\Views;
use verbb\metrix\sources\Plausible;

it('deletes sources and views from both edit forms and index requests', function(string $kind, bool $json) {
    $transaction = Craft::$app->getDb()->beginTransaction();
    $original = Metrix::$plugin->get($kind);
    Metrix::$plugin->set($kind, $service = $kind === 'sources' ? new Sources() : new Views());
    try {
        $model = $kind === 'sources'
            ? new Plausible(['name' => 'Delete source', 'handle' => 'deleteSource'])
            : new View(['name' => 'Delete view', 'handle' => 'deleteView']);
        $save = $kind === 'sources' ? 'saveSource' : 'saveView';
        $lookup = $kind === 'sources' ? 'getSourceById' : 'getViewById';
        expect($service->$save($model))->toBeTrue();
        CpRequestContext::activate('actions/metrix/' . $kind . '/delete');
        AdminUser::login();
        $request = Craft::$app->getRequest();
        $request->getHeaders()->set('Accept', $json ? 'application/json' : 'text/html');
        $idKey = $kind === 'sources' && !$json ? 'sourceId' : 'id';
        $request->setBodyParams([
            $idKey => $model->id,
            'redirect' => Craft::$app->getSecurity()->hashData('metrix/' . $kind),
        ]);
        $controller = $kind === 'sources' ? new SourcesController('sources', Metrix::$plugin) : new ViewsController('views', Metrix::$plugin);
        $response = $controller->actionDelete();
        expect($service->$lookup($model->id))->toBeNull();
        if ($json) {
            expect($response->format)->toBe('json');
        } else {
            expect($response->getStatusCode())->toBe(302)
                ->and($response->getHeaders()->get('Location'))->toContain('metrix/' . $kind);
        }
    } finally {
        $transaction->rollBack();
        Metrix::$plugin->set($kind, $original);
    }
})->with(['sources', 'views'])->with([true, false]);
