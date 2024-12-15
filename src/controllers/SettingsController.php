<?php
namespace verbb\metrix\controllers;

use verbb\metrix\Metrix;
use verbb\metrix\helpers\Plugin;
use verbb\metrix\models\Settings;

use Craft;
use craft\helpers\Json;
use craft\helpers\UrlHelper;
use craft\web\Controller;

use yii\web\Response;

class SettingsController extends Controller
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

    public function actionSaveSettings(): ?Response
    {
        $this->requirePostRequest();

        $request = $this->request;

        /* @var Settings $settings */
        $settings = Metrix::$plugin->getSettings();
        $settings->setAttributes($request->getParam('settings'), false);

        if (!$settings->validate()) {
            $this->setFailFlash(Craft::t('metrix', 'Couldn’t save settings.'));

            Craft::$app->getUrlManager()->setRouteParams([
                'settings' => $settings,
            ]);

            return null;
        }

        $pluginSettingsSaved = Craft::$app->getPlugins()->savePluginSettings(Metrix::$plugin, $settings->toArray());

        if (!$pluginSettingsSaved) {
            $this->setFailFlash(Craft::t('metrix', 'Couldn’t save settings.'));

            Craft::$app->getUrlManager()->setRouteParams([
                'settings' => $settings,
            ]);

            return null;
        }

        $this->setSuccessFlash(Craft::t('metrix', 'Settings saved.'));

        return $this->redirectToPostedUrl();
    }
}
