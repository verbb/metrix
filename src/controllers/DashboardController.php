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

use yii\web\BadRequestHttpException;
use yii\web\ForbiddenHttpException;
use yii\web\Response;
use yii\web\TooManyRequestsHttpException;

use Throwable;

class DashboardController extends Controller
{
    // Constants
    // =========================================================================

    private const MAX_BATCH_ITEMS = 50;
    private const MAX_BATCH_WIDGETS = 25;
    private const REFRESH_COOLDOWN = 5;


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

        $periodOptions = Options::getEnabledGroupedPeriodOptions();
        $viewOptions = Options::getViewOptions();
        $widgetTypeOptions = Options::getEnabledWidgetTypeSchemaOptions();
        $newWidget = Widget::getNewWidgetConfig();
        $sources = Options::getSourceOptions();
        $presets = Options::getPresetOptions();

        $currentView = Options::resolveViewHandle(
            $this->request->getParam('view'),
            $viewOptions,
        );

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
            'canManageViewLayouts' => DashboardPermissions::canManageViewLayouts(),
        ];

        $view->registerJs('new Craft.Metrix.Dashboard(' . Json::encode($data) . ');');

        return $this->renderTemplate('metrix/dashboard');
    }

    public function actionWidgets(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $viewHandle = $this->request->getParam('view');
        DashboardPermissions::requireViewHandleAccess($viewHandle);

        $widgets = Metrix::$plugin->getWidgets()->getWidgetsForView($viewHandle);

        return $this->asJson($widgets);
    }

    public function actionApplyPreset(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        DashboardPermissions::requireViewLayoutManagement();

        $viewHandle = $this->request->getRequiredParam('view');
        $presetHandle = $this->request->getRequiredParam('preset');
        $view = DashboardPermissions::requireViewHandleAccess($viewHandle);
        $widgetsService = Metrix::$plugin->getWidgets();
        $mutex = Craft::$app->getMutex();
        $mutexName = 'metrix:apply-preset:' . hash('sha256', $viewHandle);

        if (!$mutex->acquire($mutexName, 10)) {
            return $this->asFailure(Craft::t('metrix', 'The dashboard is busy. Please try again.'));
        }

        try {
            // Presets initialise an empty view. The per-view lock makes concurrent
            // retries idempotent instead of creating duplicate dashboards.
            if (array_filter($widgetsService->getAllWidgets(), fn($widget) => $widget->viewId === $view->id)) {
                return $this->asFailure(Craft::t('metrix', 'Presets can only be applied to an empty dashboard.'));
            }

            $preset = Metrix::$plugin->getPresets()->getPresetByHandle($presetHandle);

            if (!$preset) {
                return $this->asFailure(Craft::t('metrix', 'Unable to find preset.'));
            }

            $presetWidgets = $preset->getWidgets();

            foreach ($presetWidgets as $widget) {
                if (!$widgetsService->isAllowedWidgetType($widget::class)) {
                    return $this->asFailure(Craft::t('metrix', 'This preset contains unavailable widget types.'));
                }
            }

            // Presets can be stored in project config before any source exists, but saved
            // widgets require one.
            $firstSource = Metrix::$plugin->getSources()->getAllConfiguredSources()[0] ?? null;

            if (!$firstSource) {
                return $this->asFailure(Craft::t('metrix', 'You must have at least one source enabled.'));
            }

            $transaction = Craft::$app->getDb()->beginTransaction();

            try {
                foreach ($presetWidgets as $widget) {
                    $widget->setView($view);

                    if (!$widget->getSource()) {
                        $widget->setSource($firstSource);
                    }

                    if (!$widgetsService->saveWidget($widget)) {
                        $transaction->rollBack();

                        return $this->asFailure(Craft::t('metrix', 'Unable to save widget.'));
                    }
                }

                $transaction->commit();
            } catch (Throwable $e) {
                $transaction->rollBack();

                throw $e;
            }

            return $this->asJson($widgetsService->getWidgetsForView($viewHandle));
        } finally {
            $mutex->release($mutexName);
        }
    }

    public function actionPropertyOptions(): Response
    {
        $this->requireAcceptsJson();
        DashboardPermissions::requireViewLayoutManagement();

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
        } catch (ForbiddenHttpException $e) {
            return $this->asFailure($e->getMessage());
        }

        $refreshCache = $this->_getRefreshFromRequest();

        if ($refreshCache) {
            $this->requirePostRequest();
            $this->_requireRefreshBudget($widget->id);
        }

        try {
            return $this->asJson($widget->getWidgetData(
                $this->_getGlobalPeriodFromRequest(),
                $refreshCache,
            ));
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
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        DashboardPermissions::requireDashboardAccess();

        $ids = $this->request->getBodyParam('ids', []);

        if (!is_array($ids) || $ids === []) {
            return $this->asFailure(Craft::t('metrix', 'Provide one or more widget IDs.'));
        }

        if (count($ids) > self::MAX_BATCH_ITEMS) {
            throw new BadRequestHttpException(Craft::t('metrix', 'A batch can contain at most {count} widget IDs.', [
                'count' => self::MAX_BATCH_ITEMS,
            ]));
        }

        $ids = $this->_normalizeWidgetIds($ids);

        if (count($ids) > self::MAX_BATCH_WIDGETS) {
            throw new BadRequestHttpException(Craft::t('metrix', 'A batch can contain at most {count} unique widgets.', [
                'count' => self::MAX_BATCH_WIDGETS,
            ]));
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

                if ($refreshCache) {
                    $this->_requireRefreshBudget($widgetId);
                }

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
        DashboardPermissions::requireViewLayoutManagement();

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
                if (!Metrix::$plugin->getWidgets()->isAllowedWidgetType($type)) {
                    return $this->asFailure(Craft::t('metrix', 'Invalid widget type.'));
                }

                $currentWidget = $widget;
                $widget = Metrix::$plugin->getWidgets()->createWidget(['type' => $type]);
                $widget->setAttributes($currentWidget->getAttributes(), false);
            }
        } else {
            if (!is_string($type) || !Metrix::$plugin->getWidgets()->isAllowedWidgetType($type)) {
                return $this->asFailure(Craft::t('metrix', 'Invalid widget type.'));
            }

            $widget = Metrix::$plugin->getWidgets()->createWidget(['type' => $type]);
        }

        // Replace some handles with classes
        if (array_key_exists('source', $widgetData)) {
            $sourceHandle = ArrayHelper::remove($widgetData, 'source');
            $source = is_string($sourceHandle) ? Metrix::$plugin->getSources()->getSourceByHandle($sourceHandle) : null;

            if (!$source) {
                return $this->asFailure(Craft::t('metrix', 'Provide a valid source.'));
            }

            $widget->setSource($source);
        }

        if ($viewHandle = ArrayHelper::remove($widgetData, 'view')) {
            $view = Metrix::$plugin->getViews()->getViewByHandle($viewHandle);
            DashboardPermissions::requireViewAccess($view);
            $widget->setView($view);
        }

        if (!$widget->getSource()) {
            return $this->asFailure(Craft::t('metrix', 'Provide a valid source.'));
        }

        DashboardPermissions::requireWidgetAccess($widget);

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
        DashboardPermissions::requireViewLayoutManagement();

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
        DashboardPermissions::requireViewLayoutManagement();

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
        DashboardPermissions::requireViewLayoutManagement();

        $widgetId = (int)$this->request->getRequiredBodyParam('id');

        $originalWidget = Metrix::$plugin->getWidgets()->getWidgetById($widgetId);

        if (!$originalWidget) {
            return $this->asFailure(Craft::t('metrix', 'Widget not found.'));
        }

        DashboardPermissions::requireWidgetAccess($originalWidget);

        if (!Metrix::$plugin->getWidgets()->isAllowedWidgetType($originalWidget::class)) {
            return $this->asFailure(Craft::t('metrix', 'Invalid widget type.'));
        }

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
        $value = $this->request->getParam('refresh') ?? $this->request->getBodyParam('refresh');

        if ($value === null || $value === '') {
            return false;
        }

        $refresh = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

        if ($refresh === null) {
            throw new BadRequestHttpException(Craft::t('metrix', 'Refresh must be a boolean value.'));
        }

        return $refresh;
    }

    private function _normalizeWidgetIds(array $ids): array
    {
        $normalized = [];

        foreach ($ids as $id) {
            if ((!is_int($id) && !(is_string($id) && ctype_digit($id))) || (int)$id < 1) {
                throw new BadRequestHttpException(Craft::t('metrix', 'Widget IDs must be positive integers.'));
            }

            $normalized[(int)$id] = (int)$id;
        }

        return array_values($normalized);
    }

    private function _requireRefreshBudget(int $widgetId): void
    {
        $userId = Craft::$app->getUser()->getId();
        $cacheKey = 'metrix:widget-refresh:' . $userId . ':' . $widgetId;

        if (!Craft::$app->getCache()->add($cacheKey, true, self::REFRESH_COOLDOWN)) {
            throw new TooManyRequestsHttpException(Craft::t('metrix', 'This widget was refreshed recently. Please wait before refreshing it again.'));
        }
    }
}
