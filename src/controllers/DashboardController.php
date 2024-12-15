<?php
namespace verbb\metrix\controllers;

use verbb\metrix\Metrix;
use verbb\metrix\base\Widget;
use verbb\metrix\helpers\Options;
use verbb\metrix\helpers\Plugin;
use verbb\metrix\helpers\Schema;
use verbb\metrix\models\View;
use verbb\metrix\widgets;

use Craft;
use craft\helpers\ArrayHelper;
use craft\helpers\Json;
use craft\web\Controller;

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
        $settings = Metrix::$plugin->getSettings();

        $view = Craft::$app->getView();

        Plugin::registerAsset('src/charts/js/metrix-charts.js');

        $periodOptions = Options::getGroupedPeriodOptions();
        $viewOptions = Options::getViewOptions();
        $widgetTypeOptions = Options::getEnabledWidgetTypeSchemaOptions();
        $newWidget = Widget::getNewWigetConfig();
        $sources = Options::getSourceOptions();
        $presets = Options::getPresetOptions();
        $widgets = Metrix::$plugin->getWidgets()->getWidgetsForView(($viewOptions[0]['value'] ?? null));

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

        if (!$viewHandle) {
            return $this->asFailure(Craft::t('metrix', 'Provide a valid view.'));
        }

        $view = Metrix::$plugin->getViews()->getViewByHandle($viewHandle);

        if (!$view) {
            return $this->asFailure(Craft::t('metrix', 'Unable to find view.'));
        }

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

        $sourceHandle = $this->request->getParam('source');
        $property = $this->request->getParam('property');

        if (!$sourceHandle) {
            return $this->asFailure(Craft::t('metrix', 'Provide a valid source.'));
        }

        $source = Metrix::$plugin->getSources()->getSourceByHandle($sourceHandle);

        if (!$source) {
            return $this->asFailure(Craft::t('metrix', 'Unable to find source.'));
        }

        if ($property === 'dimensions') {
            $data = $source->getAvailableDimensions();
        }

        if ($property === 'metrics') {
            $data = $source->getAvailableMetrics();
        }

        return $this->asJson($data);
    }

    public function actionWidgetData(): Response
    {
        $this->requireAcceptsJson();

        $id = $this->request->getParam('id');

        $widget = Metrix::$plugin->getWidgets()->getWidgetById($id);

        return $this->asJson($widget->getWidgetData());
    }

    public function actionSaveWidget(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $id = $this->request->getParam('id');
        $widgetData = $this->request->getParam('widget', []) ?? [];
        $type = ArrayHelper::remove($widgetData, 'type');

        if ($id) {
            $widget = Metrix::$plugin->getWidgets()->getWidgetById($id);

            if (!$widget) {
                return $this->asFailure(Craft::t('metrix', 'Unable to find widget {id}.', ['id' => $id]));
            }

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

            $widget->setView($view);
        }

        $widget->setAttributes($widgetData);

        if (!Metrix::$plugin->getWidgets()->saveWidget($widget)) {
            return $this->asFailure(Craft::t('metrix', 'Unable to save widget {errors}.', ['errors' => Json::encode($widget->getErrors())]));
        }

        return $this->asJson($widget->getFrontEndData());
    }

    public function actionSaveWidgetOrder(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $widgetIds = $this->request->getRequiredBodyParam('ids');
        Metrix::$plugin->getWidgets()->reorderWidgets($widgetIds);

        return $this->asSuccess();
    }

    public function actionDeleteWidget(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $widgetId = $this->request->getRequiredBodyParam('id');

        Metrix::$plugin->getWidgets()->deleteWidgetById($widgetId);

        return $this->asSuccess();
    }    

    public function actionDuplicateWidget(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $widgetId = $this->request->getRequiredBodyParam('id');

        $originalWidget = Metrix::$plugin->getWidgets()->getWidgetById($widgetId);

        if (!$originalWidget) {
            return $this->asFailure(Craft::t('metrix', 'Widget not found.'));
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
}
