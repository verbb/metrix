<?php
namespace verbb\metrix\controllers;

use verbb\metrix\Metrix;
use verbb\metrix\models\AnalyticsScope;
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

    public function actionEdit(?string $handle = null, ?View $viewModel = null): Response
    {
        $viewsService = Metrix::$plugin->getViews();

        // Twig uses `viewModel` so Craft’s `view` service isn’t shadowed.
        if ($viewModel === null) {
            if ($handle !== null) {
                $viewModel = $viewsService->getViewByHandle($handle);

                if (!$viewModel) {
                    throw new NotFoundHttpException('View not found');
                }
            } else {
                $viewModel = new View();
            }
        }

        if ($viewModel->id) {
            $title = trim((string)$viewModel->name) ?: Craft::t('metrix', 'Edit View');
        } else {
            $title = Craft::t('metrix', 'Create a new view');
        }

        $scope = $viewModel->getAnalyticsScope();

        $siteOptions = [
            ['label' => Craft::t('metrix', 'Select a site'), 'value' => ''],
        ];

        foreach (Craft::$app->getSites()->getAllSites() as $site) {
            $siteOptions[] = [
                'label' => $site->name,
                'value' => (string)$site->id,
            ];
        }

        return $this->renderTemplate('metrix/views/_edit', [
            'title' => $title,
            'viewModel' => $viewModel,
            'analyticsScope' => $scope,
            'siteOptions' => $siteOptions,
            'scopeModeOptions' => [
                ['label' => Craft::t('metrix', 'None (all traffic for each source)'), 'value' => AnalyticsScope::MODE_NONE],
                ['label' => Craft::t('metrix', 'Craft site'), 'value' => AnalyticsScope::MODE_CRAFT_SITE],
                ['label' => Craft::t('metrix', 'Path prefix'), 'value' => AnalyticsScope::MODE_PATH],
                ['label' => Craft::t('metrix', 'Hostname'), 'value' => AnalyticsScope::MODE_HOSTNAME],
            ],
            'matchOptions' => [
                ['label' => Craft::t('metrix', 'Begins with'), 'value' => AnalyticsScope::MATCH_BEGINS_WITH],
                ['label' => Craft::t('metrix', 'Exact'), 'value' => AnalyticsScope::MATCH_EXACT],
                ['label' => Craft::t('metrix', 'Contains'), 'value' => AnalyticsScope::MATCH_CONTAINS],
            ],
        ]);
    }

    public function actionSave(): ?Response
    {
        $this->requirePostRequest();

        $viewId = $this->request->getParam('id');
        $view = $viewId
            ? (Metrix::$plugin->getViews()->getViewById((int)$viewId) ?? new View())
            : new View();

        $view->name = $this->request->getParam('name');
        $view->handle = $this->request->getParam('handle');

        $scopeParam = $this->request->getBodyParam('analyticsScope', []) ?: [];

        $scope = AnalyticsScope::fromConfig([
            'mode' => $scopeParam['mode'] ?? AnalyticsScope::MODE_NONE,
            'craftSiteId' => $scopeParam['craftSiteId'] ?? null,
            'pathPrefix' => $scopeParam['pathPrefix'] ?? null,
            'hostname' => $scopeParam['hostname'] ?? null,
            'match' => $scopeParam['match'] ?? AnalyticsScope::MATCH_BEGINS_WITH,
        ]);

        // Persist onto the view first so failed validation redisplays submitted scope fields.
        $view->setAnalyticsScope($scope);

        if (!$scope->validate()) {
            $view->addErrors($scope->getErrors());

            return $this->asModelFailure($view, modelName: 'viewModel');
        }

        if (!Metrix::$plugin->getViews()->saveView($view)) {
            return $this->asModelFailure($view, modelName: 'viewModel');
        }

        return $this->asModelSuccess($view, Craft::t('metrix', 'View saved.'), 'viewModel');
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
