<?php
namespace verbb\metrix\controllers;

use verbb\metrix\Metrix;
use verbb\metrix\base\Widget;
use verbb\metrix\helpers\Options;
use verbb\metrix\helpers\Plugin;
use verbb\metrix\models\Preset;
use verbb\metrix\models\Settings;

use Craft;
use craft\helpers\ArrayHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\helpers\UrlHelper;
use craft\web\Controller;

use yii\web\BadRequestHttpException;
use yii\web\NotFoundHttpException;
use yii\web\Response;

class PresetsController extends Controller
{
    // Public Methods
    // =========================================================================

    public function actionIndex(): Response
    {
        $presets = Metrix::$plugin->getPresets()->getAllPresets();

        return $this->renderTemplate('metrix/settings/presets', compact('presets'));
    }

    public function actionEdit(int $presetId = null, Preset $preset = null): Response
    {
        $presetsService = Metrix::$plugin->getPresets();

        if ($preset === null) {
            if ($presetId !== null) {
                $preset = $presetsService->getPresetById($presetId);

                if ($preset === null) {
                    throw new NotFoundHttpException('Preset not found');
                }
            } else {
                $preset = new Preset();
            }
        }

        $isNewPreset = !$preset->id;

        if ($isNewPreset) {
            $title = Craft::t('metrix', 'Create a new preset');
        } else {
            $title = trim($preset->name) ?: Craft::t('metrix', 'Edit preset');
        }

        $baseUrl = 'metrix/settings/presets';
        $continueEditingUrl = 'metrix/settings/presets/edit/{id}';

        $settings = Metrix::$plugin->getSettings();

        Plugin::registerAsset('src/apps/presets/metrix-presets.js');
        $this->view->registerJs('new Craft.Metrix.Presets(' . Json::encode($preset->getComponentSettings()) . ');');

        $firstSource = Metrix::$plugin->getSources()->getAllConfiguredSources()[0] ?? null;

        return $this->renderTemplate('metrix/settings/presets/_edit', [
            'preset' => $preset,
            'isNewPreset' => $isNewPreset,
            'baseUrl' => $baseUrl,
            'continueEditingUrl' => $continueEditingUrl,
            'title' => $title,
            'hasSource' => (bool)$firstSource,
        ]);
    }

    public function actionSave(): ?Response
    {
        $this->requirePostRequest();

        $presetsService = Metrix::$plugin->getPresets();
        $type = $this->request->getParam('type');
        $presetId = (int)$this->request->getParam('id');
        $widgets = Json::decode($this->request->getParam('widgets', ''));
        $savedPreset = null;

        if ($presetId) {
            $savedPreset = $presetsService->getPresetById($presetId);

            if (!$savedPreset) {
                throw new BadRequestHttpException("Invalid preset ID: $presetId");
            }
        }

        $preset = new Preset([
            'id' => $presetId ?: null,
            'name' => $this->request->getParam('name'),
            'handle' => $this->request->getParam('handle'),
            'sortOrder' => $savedPreset->sortOrder ?? null,
            'enabled' => (bool)$this->request->getParam('enabled'),
            'uid' => $savedPreset->uid ?? null,
        ]);

        $preset->setWidgets($widgets);

        if (!$presetsService->savePreset($preset)) {
            $this->setFailFlash(Craft::t('metrix', 'Couldn’t save preset.'));

            // Send the preset back to the template
            Craft::$app->getUrlManager()->setRouteParams([
                'preset' => $preset,
            ]);

            return null;
        }

        $this->setSuccessFlash(Craft::t('metrix', 'Preset saved.'));

        return $this->redirectToPostedUrl($preset);
    }

    public function actionReorder(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $presetsIds = Json::decode($this->request->getRequiredParam('ids'));
        Metrix::$plugin->getPresets()->reorderPresets($presetsIds);

        return $this->asJson(['success' => true]);
    }

    public function actionDelete(): Response
    {
        $this->requirePostRequest();

        $request = Craft::$app->getRequest();
        $presetsId = $request->getRequiredParam('id');

        Metrix::$plugin->getPresets()->deletePresetById($presetsId);

        if ($request->getAcceptsJson()) {
            return $this->asJson([
                'success' => true,
            ]);
        }

        $this->setSuccessFlash(Craft::t('metrix', 'Preset deleted.'));

        return $this->redirectToPostedUrl();
    }
}
