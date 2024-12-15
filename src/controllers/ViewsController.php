<?php
namespace verbb\metrix\controllers;

use verbb\metrix\Metrix;
use verbb\metrix\models\View;

use Craft;
use craft\helpers\Json;
use craft\web\Controller;

use yii\web\NotFoundHttpException;
use yii\web\Response;

class ViewsController extends Controller
{
    // Public Methods
    // =========================================================================

    public function actionIndex(): Response
    {
        $views = Metrix::$plugin->getViews()->getAllViews();

        return $this->renderTemplate('metrix/views', [
            'views' => $views,
        ]);
    }

    public function actionEdit(?string $handle = null, ?View $view = null): Response
    {
        $viewsService = Metrix::$plugin->getViews();

        if ($view === null) {
            if ($handle !== null) {
                $view = $viewsService->getViewByHandle($handle);

                if (!$view) {
                    throw new NotFoundHttpException('View not found');
                }
            } else {
                $view = new View();
            }
        }

        if ($view->id) {
            $title = trim($view->name) ?: Craft::t('metrix', 'Edit View');
        } else {
            $title = Craft::t('metrix', 'Create a new view');
        }

        return $this->renderTemplate('metrix/views/_edit', [
            'title' => $title,
            'viewModel' => $view,
        ]);
    }

    public function actionSave(): ?Response
    {
        $this->requirePostRequest();

        $view = new View();
        $view->id = $this->request->getParam('id');
        $view->name = $this->request->getParam('name');
        $view->handle = $this->request->getParam('handle');

        if (!Metrix::$plugin->getViews()->saveView($view)) {
            return $this->asModelFailure($view, modelName: 'view');
        }

        return $this->asModelSuccess($view, Craft::t('metrix', 'View saved.'));
    }

    public function actionReorder(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $viewIds = Json::decode($this->request->getRequiredBodyParam('ids'));
        Metrix::$plugin->getViews()->reorderViews($viewIds);

        return $this->asSuccess();
    }

    public function actionDelete(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $viewId = $this->request->getRequiredBodyParam('id');

        Metrix::$plugin->getViews()->deleteViewById($viewId);

        return $this->asSuccess();
    }

}
