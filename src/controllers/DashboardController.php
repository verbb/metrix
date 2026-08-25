<?php
namespace verbb\metrix\controllers;

use verbb\metrix\Metrix;
use verbb\metrix\base\Source;
use verbb\metrix\base\Widget;
use verbb\metrix\helpers\DashboardPermissions;
use verbb\metrix\helpers\Options;
use verbb\metrix\helpers\Plugin;

use Craft;
use craft\helpers\ArrayHelper;
use craft\helpers\Json;
use craft\web\Controller;

use Throwable;
use yii\web\ForbiddenHttpException;
use yii\web\Response;

class DashboardController extends Controller
{
    // Public Methods
    // =========================================================================

    public function beforeAction($action): bool
    {
        if (!parent::beforeAction($action)) {
            return false;
        }

        $this->requireCpRequest();

        return true;
    }

    public function actionIndex(): Response
    {
        DashboardPermissions::requireDashboardAccess();

        $settings = Metrix::$plugin->getSettings();
        $view = Craft::$app->getView();

        Plugin::registerDashboardAssets();

        $periodOptions = Options::getGroupedPeriodOptions();
        $viewOptions = Options::getViewOptions();
        $widgetTypeOptions = Options::getEnabledWidgetTypeSchemaOptions();
        $newWidget = Widget::getNewWidgetConfig();
        $sources = Options::getSourceOptions();
        $presets = Options::getPresetOptions();

        $currentView = $this->request->getParam('view') ?? $viewOptions[0]['value'] ?? null;

        if ($currentView) {
            DashboardPermissions::requireViewHandleAccess($currentView);
        }

        $widgets = Metrix::$plugin->getWidgets()->getWidgetsForView($currentView);

        $data = [
            'widgets' => $widgets,
            'widgetSettings' => $widgetTypeOptions,
            'realtimeInterval' => $settings->getRealtimeInterval(),
            'newWidget' => $newWidget,
            'sources' => $sources,
            'presets' => $presets,
            'periodOptions' => $periodOptions,
            'viewOptions' => $viewOptions,
        ];

        $view->registerJs('new Craft.Metrix.Dashboard(' . Json::encode($data) . ');');

        return $this->renderTemplate('metrix/dashboard');
    }

    public function actionWidgets(): Response
    {
        $this->requireAcceptsJson();

        $viewHandle = $this->request->getParam('view');
        $presetHandle = $this->request->getParam('preset');

        $view = DashboardPermissions::requireViewHandleAccess($viewHandle);

        // Load up any presets
        if ($presetHandle) {
            $preset = Metrix::$plugin->getPresets()->getPresetByHandle($presetHandle);

            if (!$preset) {
                return $this->asFailure(Craft::t('metrix', 'Unable to find preset.'));
            }

            // Presets often have no source set, because they can be saved at the project config level before
            // any sources exist. But when converting to widgets, they must have a source.
            $firstSource = Metrix::$plugin->getSources()->getAllConfiguredSources()[0] ?? null;

            if (!$firstSource) {
                return $this->asFailure(Craft::t('metrix', 'You must have at least one source enabled.'));
            }

            foreach ($preset->getWidgets() as $widget) {
                $widget->setView($view);

                // Set a default source, if not already set
                if (!$widget->getSource()) {
                    $widget->setSource($firstSource);
                }

                if (!Metrix::$plugin->getWidgets()->saveWidget($widget)) {
                    return $this->asFailure(Craft::t('metrix', 'Unable to save widget.'));
                }
            }
        }

        $widgets = Metrix::$plugin->getWidgets()->getWidgetsForView($viewHandle);

        return $this->asJson($widgets);
    }

    public function actionPropertyOptions(): Response
    {
        $this->requireAcceptsJson();
        DashboardPermissions::requireDashboardAccess();

        $sourceHandle = $this->request->getParam('source');
        $property = $this->request->getParam('property');

        if (!$sourceHandle) {
            return $this->asFailure(Craft::t('metrix', 'Provide a valid source.'));
        }

        $source = Metrix::$plugin->getSources()->getSourceByHandle($sourceHandle);

        if (!$source) {
            return $this->asFailure(Craft::t('metrix', 'Unable to find source.'));
        }

        $data = [];

        if ($property === 'dimensions') {
            $data = $source->getAvailableDimensions();
        } elseif ($property === 'metrics') {
            $data = $source->getAvailableMetrics();
        }

        return $this->asJson($data);
    }

    public function actionWidgetData(): Response
    {
        $this->requireAcceptsJson();

        $id = (int)$this->request->getParam('id');
        $widget = Metrix::$plugin->getWidgets()->getWidgetById($id);

        if (!$widget) {
            return $this->asFailure(Craft::t('metrix', 'Unable to find widget {id}.', ['id' => $id]));
        }

        try {
            DashboardPermissions::requireWidgetAccess($widget);

            return $this->asJson($widget->getWidgetData(
                $this->_getGlobalPeriodFromRequest(),
                $this->_getRefreshFromRequest(),
            ));
        } catch (ForbiddenHttpException $e) {
            return $this->asFailure($e->getMessage());
        } catch (Throwable $e) {
            if ($source = $widget->getSource()) {
                if (Source::isOAuthReconnectFailure($e)) {
                    Source::apiError($source, $e, false);
                }
            }

            return $this->asFailure(Source::formatDashboardExceptionMessage($e));
        }
    }

    public function actionBatchWidgetData(): Response
    {
        $this->requireAcceptsJson();
        DashboardPermissions::requireDashboardAccess();

        $ids = $this->request->getBodyParam('ids', []);

        if (!is_array($ids) || $ids === []) {
            return $this->asFailure(Craft::t('metrix', 'Provide one or more widget IDs.'));
        }

        $globalPeriod = $this->_getGlobalPeriodFromRequest();
        $refreshCache = $this->_getRefreshFromRequest();
        $results = [];

        foreach ($ids as $id) {
            $widgetId = (int)$id;
            $widget = Metrix::$plugin->getWidgets()->getWidgetById($widgetId);

            if (!$widget) {
                $results[$widgetId] = [
                    'success' => false,
                    'error' => Craft::t('metrix', 'Unable to find widget {id}.', ['id' => $widgetId]),
                ];
                continue;
            }

            try {
                DashboardPermissions::requireWidgetAccess($widget);

                $results[$widgetId] = [
                    'success' => true,
                    'data' => $widget->getWidgetData($globalPeriod, $refreshCache),
                ];
            } catch (ForbiddenHttpException $e) {
                $results[$widgetId] = [
                    'success' => false,
                    'error' => $e->getMessage(),
                ];
            } catch (Throwable $e) {
                // Widget data fetch already ran apiError for provider failures; map reconnect cleanly.
                if ($source = $widget->getSource()) {
                    if (Source::isOAuthReconnectFailure($e)) {
                        Source::apiError($source, $e, false);
                    }
                }

                $results[$widgetId] = [
                    'success' => false,
                    'error' => Source::formatDashboardExceptionMessage($e),
                ];
            }
        }

        return $this->asJson($results);
    }

    public function actionSaveWidget(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        DashboardPermissions::requireDashboardAccess();

        $id = $this->request->getParam('id');
        $widgetData = $this->request->getParam('widget', []) ?? [];
        $type = ArrayHelper::remove($widgetData, 'type');

        if ($id) {
            $widget = Metrix::$plugin->getWidgets()->getWidgetById($id);

            if (!$widget) {
                return $this->asFailure(Craft::t('metrix', 'Unable to find widget {id}.', ['id' => $id]));
            }

            DashboardPermissions::requireWidgetAccess($widget);

            // If we're changing the type of an existing widget, set things up
            if ($type && $widget::class !== $type) {
                $currentWidget = $widget;

                $widget = new $type;
                $widget->setAttributes($currentWidget->getAttributes(), false);
            }
        } else {
            $widget = new $type;
        }

        // Replace some handles with classes
        if ($sourceHandle = ArrayHelper::remove($widgetData, 'source')) {
            $source = Metrix::$plugin->getSources()->getSourceByHandle($sourceHandle);

            $widget->setSource($source);
        }

        if ($viewHandle = ArrayHelper::remove($widgetData, 'view')) {
            $view = Metrix::$plugin->getViews()->getViewByHandle($viewHandle);
            DashboardPermissions::requireViewAccess($view);
            $widget->setView($view);
        }

        $metric = ArrayHelper::remove($widgetData, 'metric');
        $dimension = ArrayHelper::remove($widgetData, 'dimension');

        if (array_key_exists('inheritPeriod', $widgetData)) {
            $widget->inheritPeriod = (bool)ArrayHelper::remove($widgetData, 'inheritPeriod');

            if ($widget->inheritPeriod) {
                $widget->period = null;
            }
        }

        ArrayHelper::remove($widgetData, 'metricLabel');
        ArrayHelper::remove($widgetData, 'dimensionLabel');
        ArrayHelper::remove($widgetData, 'periodLabel');

        $widget->setAttributes($widgetData);
        $widget->normalizePropertyFields($metric, $dimension);

        if (!Metrix::$plugin->getWidgets()->saveWidget($widget)) {
            return $this->asFailure(Craft::t('metrix', 'Unable to save widget {errors}.', ['errors' => Json::encode($widget->getErrors())]));
        }

        return $this->asJson($widget->getFrontEndData());
    }

    public function actionSaveWidgetOrder(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        DashboardPermissions::requireDashboardAccess();

        $widgetIds = $this->request->getRequiredBodyParam('ids');

        foreach ($widgetIds as $widgetId) {
            $widget = Metrix::$plugin->getWidgets()->getWidgetById((int)$widgetId);

            if ($widget) {
                DashboardPermissions::requireWidgetAccess($widget);
            }
        }

        Metrix::$plugin->getWidgets()->reorderWidgets($widgetIds);

        return $this->asSuccess();
    }

    public function actionDeleteWidget(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        DashboardPermissions::requireDashboardAccess();

        $widgetId = (int)$this->request->getRequiredBodyParam('id');
        $widget = Metrix::$plugin->getWidgets()->getWidgetById($widgetId);

        if (!$widget) {
            return $this->asFailure(Craft::t('metrix', 'Widget not found.'));
        }

        DashboardPermissions::requireWidgetAccess($widget);
        Metrix::$plugin->getWidgets()->deleteWidgetById($widgetId);

        return $this->asSuccess();
    }

    public function actionDuplicateWidget(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        DashboardPermissions::requireDashboardAccess();

        $widgetId = (int)$this->request->getRequiredBodyParam('id');

        $originalWidget = Metrix::$plugin->getWidgets()->getWidgetById($widgetId);

        if (!$originalWidget) {
            return $this->asFailure(Craft::t('metrix', 'Widget not found.'));
        }

        DashboardPermissions::requireWidgetAccess($originalWidget);

        $duplicatedWidget = clone $originalWidget;
        $duplicatedWidget->id = null;
        $duplicatedWidget->uid = null;
        $duplicatedWidget->sortOrder = null;

        if (!Metrix::$plugin->getWidgets()->saveWidget($duplicatedWidget)) {
            return $this->asFailure(Craft::t('metrix', 'Failed to duplicate widget.'));
        }

        return $this->asJson($duplicatedWidget->getFrontEndData());
    }


    // Private Methods
    // =========================================================================

    private function _getGlobalPeriodFromRequest(): ?string
    {
        return $this->request->getParam('globalPeriod')
            ?? $this->request->getBodyParam('globalPeriod');
    }

    private function _getRefreshFromRequest(): bool
    {
        return (bool)($this->request->getParam('refresh') ?? $this->request->getBodyParam('refresh'));
    }
}
