<?php
namespace verbb\metrix\controllers;

use verbb\metrix\Metrix;
use verbb\metrix\models\Settings;

use Craft;

use yii\web\Response;

use verbb\base\controllers\SettingsController as BaseSettingsController;

class SettingsController extends BaseSettingsController
{
    // Public Methods
    // =========================================================================

    public function actionIndex(): Response
    {
        /* @var Settings $settings */
        $settings = Metrix::$plugin->getSettings();

        return $this->renderTemplate('metrix/settings', [
            'settings' => $settings,
        ]);
    }

    public function actionWidgets(): Response
    {
        /* @var Settings $settings */
        $settings = Metrix::$plugin->getSettings();

        $allWidgetTypes = Metrix::$plugin->getWidgets()->getAllWidgetTypes();

        $widgetInstances = [];
        $widgetOptions = [];

        foreach ($allWidgetTypes as $widgetType) {
            $widgetInstance = Craft::createObject($widgetType);

            $widgetInstances[$widgetType] = $widgetInstance;

            $widgetOptions[] = [
                'label' => $widgetInstance::displayName(),
                'value' => $widgetType,
            ];
        }

        return $this->renderTemplate('metrix/settings/widgets', [
            'settings' => $settings,
            'widgetOptions' => $widgetOptions,
            'widgetInstances' => $widgetInstances,
            'widgetTypes' => $allWidgetTypes,
        ]);
    }

}
