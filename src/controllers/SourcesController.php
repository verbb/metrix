<?php
namespace verbb\metrix\controllers;

use verbb\metrix\Metrix;
use verbb\metrix\base\SourceInterface;
use verbb\metrix\helpers\Plugin;

use Craft;
use craft\helpers\ArrayHelper;
use craft\helpers\Json;
use craft\web\Controller;

use yii\web\BadRequestHttpException;
use yii\web\NotFoundHttpException;
use yii\web\Response;

use Exception;

class SourcesController extends Controller
{
    // Public Methods
    // =========================================================================

    public function actionIndex(): Response
    {
        $sources = Metrix::$plugin->getSources()->getAllSources();

        return $this->renderTemplate('metrix/sources', [
            'sources' => $sources,
        ]);
    }

    public function actionEdit(?string $handle = null, SourceInterface $source = null): Response
    {
        $sourcesService = Metrix::$plugin->getSources();

        if ($source === null) {
            if ($handle !== null) {
                $source = $sourcesService->getSourceByHandle($handle);

                if ($source === null) {
                    throw new NotFoundHttpException('Source not found');
                }
            }
        }

        $allSourceTypes = $sourcesService->getAllSourceTypes();

        $sourceInstances = [];
        $sourceOptions = [];

        foreach ($allSourceTypes as $sourceType) {
            /** @var SourceInterface $sourceInstance */
            $sourceInstance = Craft::createObject($sourceType);

            if ($source === null) {
                $source = $sourceInstance;
            }

            $sourceInstances[$sourceType] = $sourceInstance;

            $sourceOptions[] = [
                'value' => $sourceType,
                'label' => $sourceInstance::displayName(),
            ];
        }

        // Sort them by name
        ArrayHelper::multisort($sourceOptions, 'label');

        if ($handle && $sourcesService->getSourceByHandle($handle)) {
            $title = trim($source->name) ?: Craft::t('metrix', 'Edit Source');
        } else {
            $title = Craft::t('metrix', 'Create a new source');
        }

        Plugin::registerAsset('src/apps/sources/metrix-sources.js');
        $this->view->registerJs('new Craft.Metrix.SourceConnect(' . Json::encode([]) . ');');

        return $this->renderTemplate('metrix/sources/_edit', [
            'title' => $title,
            'source' => $source,
            'sourceOptions' => $sourceOptions,
            'sourceInstances' => $sourceInstances,
            'sourceTypes' => $allSourceTypes,
        ]);
    }

    public function actionSave(): ?Response
    {
        $this->requirePostRequest();

        $sourcesService = Metrix::$plugin->getSources();
        $sourceId = $this->request->getParam('sourceId') ?: null;
        $type = $this->request->getParam('type');

        if ($sourceId) {
            $oldSource = $sourcesService->getSourceById($sourceId);
            
            if (!$oldSource) {
                throw new BadRequestHttpException("Invalid source ID: $sourceId");
            }
        }

        $source = $sourcesService->createSource([
            'id' => $sourceId,
            'type' => $type,
            'name' => $this->request->getParam('name'),
            'handle' => $this->request->getParam('handle'),
            'enabled' => (bool)$this->request->getParam('enabled'),
            'settings' => $this->request->getParam("types.$type"),
        ]);

        if (!$sourcesService->saveSource($source)) {
            return $this->asModelFailure($source, Craft::t('metrix', 'Couldn’t save source.'), 'source');
        }

        return $this->asModelSuccess($source, Craft::t('metrix', 'Source saved.'), 'source');
    }

    public function actionReorder(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $sourceIds = Json::decode($this->request->getRequiredBodyParam('ids'));
        Metrix::$plugin->getSources()->reorderSources($sourceIds);

        return $this->asSuccess();
    }

    public function actionDelete(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $sourceId = $this->request->getRequiredBodyParam('id');

        Metrix::$plugin->getSources()->deleteSourceById($sourceId);

        return $this->asSuccess();
    }

    public function actionRefreshSettings(): Response
    {
        $this->requireAcceptsJson();

        $sourcesService = Metrix::$plugin->getSources();

        $sourceData = $this->request->getBodyParam('sourceData');
        $sourceHandle = $this->request->getRequiredBodyParam('source');
        $setting = $this->request->getRequiredBodyParam('setting');

        $source = $sourcesService->getSourceByHandle($sourceHandle);
        
        if (!$source) {
            throw new BadRequestHttpException("Invalid source: $sourceHandle");
        }

        // Set any data provided by this call to the source
        $source->setAttributes($sourceData, false);

        return $this->asJson($source->getSourceSettings($setting, false));
    }

    public function actionCheckConnection(): Response
    {
        $this->requirePostRequest();

        $request = $this->request;
        $type = $request->getParam('type');
        $sourceId = $request->getParam('sourceId');

        if (!$sourceId) {
            return $this->asFailure(Craft::t('metrix', 'Unknown source: “{id}”', ['id' => $sourceId]));
        }

        $source = Metrix::$plugin->getSources()->getSourceById($sourceId);

        if (!$source::supportsConnection()) {
            return $this->asFailure(Craft::t('metrix', '“{id}” does not support connection.', ['id' => $sourceId]));
        }

        try {
            // Check to see if it's valid. Exceptions help to provide errors nicely
            return $this->asJson([
                'success' => $source->checkConnection(false),
            ]);
        } catch (Exception $e) {
            return $this->asFailure($e->getMessage());
        }
    }
}
