<?php
namespace verbb\metrix\controllers;

use Craft;
// use craft\base\WidgetInterface;
// use craft\helpers\App;
// use craft\helpers\ArrayHelper;
// use craft\helpers\Component;
// use craft\helpers\FileHelper;
use craft\helpers\Json;
// use craft\helpers\StringHelper;
// use craft\models\CraftSupport;
// use craft\web\assets\dashboard\DashboardAsset;
use craft\web\Controller;
// use craft\web\UploadedFile;
// use GuzzleHttp\RequestOptions;
// use Symfony\Component\Yaml\Yaml;
// use Throwable;
// use yii\base\Exception;
// use yii\web\BadRequestHttpException;
use yii\web\Response;
// use ZipArchive;


use verbb\metrix\helpers\Plugin;


class DashboardController extends Controller
{
    // public function beforeAction($action): bool
    // {
    //     if (!parent::beforeAction($action)) {
    //         return false;
    //     }

    //     $this->requireCpRequest();

    //     return true;
    // }

    public function actionIndex(): Response
    {
        $view = Craft::$app->getView();

        Plugin::registerAsset('charts/src/js/metrix.js');

        $view->registerJs('new Craft.Metrix.Dashboard(' . Json::encode([]) . ');');

        return $this->renderTemplate('metrix/dashboard', [
            // 'settings' => $settings,
        ]);
    }

    // public function actionIndex(): Response
    // {
    //     $dashboardService = Craft::$app->getDashboard();
    //     $view = $this->getView();

    //     // Assemble the list of available widget types
    //     $widgetTypes = $dashboardService->getAllWidgetTypes();
    //     $widgetTypeInfo = [];

    //     foreach ($widgetTypes as $widgetType) {
    //         /** @var string|WidgetInterface $widgetType */
    //         /** @phpstan-var class-string<WidgetInterface>|WidgetInterface $widgetType */
    //         if (!$widgetType::isSelectable()) {
    //             continue;
    //         }

    //         $view->startJsBuffer();
    //         $widget = $dashboardService->createWidget($widgetType);
    //         $settingsHtml = $view->namespaceInputs(function() use ($widget) {
    //             return (string)$widget->getSettingsHtml();
    //         }, '__NAMESPACE__');
    //         $settingsJs = (string)$view->clearJsBuffer(false);

    //         $class = get_class($widget);
    //         $widgetTypeInfo[$class] = [
    //             'iconSvg' => $this->_getWidgetIconSvg($widget),
    //             'name' => $widget::displayName(),
    //             'maxColspan' => $widget::maxColspan(),
    //             'settingsHtml' => $settingsHtml,
    //             'settingsJs' => $settingsJs,
    //             'selectable' => true,
    //         ];
    //     }

    //     // Sort them by name
    //     ArrayHelper::multisort($widgetTypeInfo, 'name');

    //     $variables = [];

    //     // Assemble the list of existing widgets
    //     $variables['widgets'] = [];
    //     $widgets = $dashboardService->getAllWidgets();
    //     $allWidgetJs = '';

    //     foreach ($widgets as $widget) {
    //         $view->startJsBuffer();
    //         $info = $this->_getWidgetInfo($widget);
    //         $widgetJs = $view->clearJsBuffer(false);

    //         if ($info === false) {
    //             continue;
    //         }

    //         // If this widget type didn't come back in our getAllWidgetTypes() call, add it now
    //         if (!isset($widgetTypeInfo[$info['type']])) {
    //             $widgetTypeInfo[$info['type']] = [
    //                 'iconSvg' => $this->_getWidgetIconSvg($widget),
    //                 'name' => $widget::displayName(),
    //                 'maxColspan' => $widget::maxColspan(),
    //                 'selectable' => false,
    //             ];
    //         }

    //         $variables['widgets'][] = $info;

    //         $allWidgetJs .= 'new Craft.Widget("#widget' . $widget->id . '", ' .
    //             Json::encode($info['settingsHtml']) . ', ' .
    //             '() => {' . $info['settingsJs'] . '},' .
    //             Json::encode($info['settings']) .
    //             ");\n";

    //         if (!empty($widgetJs)) {
    //             // Allow any widget JS to execute *after* we've created the Craft.Widget instance
    //             $allWidgetJs .= $widgetJs . "\n";
    //         }
    //     }

    //     // Include all the JS and CSS stuff
    //     $view->registerAssetBundle(DashboardAsset::class);
    //     $view->registerJsWithVars(
    //         fn($widgetTypeInfo) => "window.dashboard = new Craft.Dashboard($widgetTypeInfo)",
    //         [$widgetTypeInfo]
    //     );
    //     $view->registerJs($allWidgetJs);

    //     $variables['widgetTypes'] = $widgetTypeInfo;

    //     return $this->renderTemplate('dashboard/_index.twig', $variables);
    // }

    // public function actionCreateWidget(): Response
    // {
    //     $this->requirePostRequest();
    //     $this->requireAcceptsJson();

    //     $dashboardService = Craft::$app->getDashboard();

    //     $type = $this->request->getRequiredBodyParam('type');
    //     $settings = $this->request->getBodyParam('settings');

    //     if (!$settings) {
    //         $settingsNamespace = $this->request->getBodyParam('settingsNamespace');
    //         if ($settingsNamespace) {
    //             $settings = $this->request->getBodyParam($settingsNamespace);
    //         }
    //     }

    //     $widget = $dashboardService->createWidget([
    //         'type' => $type,
    //         'settings' => $settings,
    //     ]);

    //     return $this->_saveAndReturnWidget($widget);
    // }

    // public function actionSaveWidgetSettings(): Response
    // {
    //     $this->requirePostRequest();
    //     $this->requireAcceptsJson();

    //     $dashboardService = Craft::$app->getDashboard();
    //     $widgetId = $this->request->getRequiredBodyParam('widgetId');

    //     // Get the existing widget
    //     $widget = $dashboardService->getWidgetById($widgetId);

    //     if (!$widget) {
    //         throw new BadRequestHttpException();
    //     }

    //     // Create a new widget model with the new settings
    //     $settings = $this->request->getBodyParam('widget' . $widget->id . '-settings');

    //     $widget = $dashboardService->createWidget([
    //         'id' => $widget->id,
    //         'dateCreated' => $widget->dateCreated,
    //         'dateUpdated' => $widget->dateUpdated,
    //         'colspan' => $widget->colspan,
    //         'type' => get_class($widget),
    //         'settings' => $settings,
    //     ]);

    //     return $this->_saveAndReturnWidget($widget);
    // }

    // public function actionDeleteUserWidget(): Response
    // {
    //     $this->requirePostRequest();
    //     $this->requireAcceptsJson();

    //     $widgetId = Json::decode($this->request->getRequiredBodyParam('id'));
    //     Craft::$app->getDashboard()->deleteWidgetById($widgetId);

    //     return $this->asSuccess();
    // }

    // public function actionChangeWidgetColspan(): Response
    // {
    //     $this->requirePostRequest();
    //     $this->requireAcceptsJson();

    //     $widgetId = $this->request->getRequiredBodyParam('id');
    //     $colspan = $this->request->getRequiredBodyParam('colspan');

    //     Craft::$app->getDashboard()->changeWidgetColspan($widgetId, $colspan);

    //     return $this->asSuccess();
    // }

    // public function actionReorderUserWidgets(): Response
    // {
    //     $this->requirePostRequest();
    //     $this->requireAcceptsJson();

    //     $widgetIds = Json::decode($this->request->getRequiredBodyParam('ids'));
    //     Craft::$app->getDashboard()->reorderWidgets($widgetIds);

    //     return $this->asSuccess();
    // }


    // private function _getWidgetInfo(WidgetInterface $widget): array|false
    // {
    //     $view = $this->getView();

    //     // Get the body HTML
    //     $widgetBodyHtml = $widget->getBodyHtml();

    //     if ($widgetBodyHtml === null) {
    //         return false;
    //     }

    //     // Get the settings HTML + JS
    //     $view->startJsBuffer();
    //     $settingsHtml = $view->namespaceInputs(function() use ($widget) {
    //         return (string)$widget->getSettingsHtml();
    //     }, "widget$widget->id-settings");
    //     $settingsJs = $view->clearJsBuffer(false);

    //     // Get the colspan (limited to the widget type's max allowed colspan)
    //     $colspan = ($widget->colspan ?: 1);

    //     if (($maxColspan = $widget::maxColspan()) && $colspan > $maxColspan) {
    //         $colspan = $maxColspan;
    //     }

    //     return [
    //         'id' => $widget->id,
    //         'type' => get_class($widget),
    //         'colspan' => $colspan,
    //         'title' => $widget->getTitle(),
    //         'subtitle' => $widget->getSubtitle(),
    //         'name' => $widget->displayName(),
    //         'bodyHtml' => $widgetBodyHtml,
    //         'settingsHtml' => $settingsHtml,
    //         'settingsJs' => (string)$settingsJs,
    //         'settings' => $widget->getSettings(),
    //     ];
    // }

    // private function _getWidgetIconSvg(WidgetInterface $widget): string
    // {
    //     return Component::iconSvg($widget::icon(), $widget::displayName());
    // }

    // private function _saveAndReturnWidget(WidgetInterface $widget): Response
    // {
    //     $dashboardService = Craft::$app->getDashboard();

    //     if (!$dashboardService->saveWidget($widget)) {
    //         return $this->asFailure(data: [
    //             'errors' => $widget->getFirstErrors(),
    //         ]);
    //     }

    //     $info = $this->_getWidgetInfo($widget);
    //     $view = $this->getView();

    //     return $this->asSuccess(data: [
    //         'info' => $info,
    //         'headHtml' => $view->getHeadHtml(),
    //         'bodyHtml' => $view->getBodyHtml(),
    //     ]);
    // }
}
