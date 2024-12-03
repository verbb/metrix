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

class PluginController extends Controller
{
    // Public Methods
    // =========================================================================

    public function actionSettings(): Response
    {
        /* @var Settings $settings */
        $settings = Metrix::$plugin->getSettings();

        return $this->renderTemplate('metrix/settings', [
            'settings' => $settings,
        ]);
    }
}
