<?php
namespace verbb\metrix\controllers;

use verbb\metrix\Metrix;
use verbb\metrix\base\CredentialSourceInterface;
use verbb\metrix\base\CredentialsSource;
use verbb\metrix\base\SourceInterface;
use verbb\metrix\helpers\Plugin;
use verbb\metrix\helpers\SourceSecurity;

use Craft;
use craft\helpers\ArrayHelper;
use craft\helpers\Json;
use craft\web\Controller;

use yii\web\BadRequestHttpException;
use yii\web\NotFoundHttpException;
use yii\web\Response;

use Exception;

use verbb\base\helpers\EnvironmentSettings;
use verbb\base\models\EnvironmentSettingsViolation;

class SourcesController extends Controller
{
    // Public Methods
    // =========================================================================

    public function beforeAction($action): bool
    {
        if (!parent::beforeAction($action)) {
            return false;
        }

        // Match CP nav: sources management is not covered by dashboard-only grants.
        $this->requirePermission('metrix-sources');

        return true;
    }

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
            /* @var SourceInterface $sourceInstance */
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

        Plugin::registerSourcesCpJs();

        if ($source->id && $source->supportsConnection()) {
            Plugin::registerSourcesAssets();
        }

        $canManageSourceCredentials = Craft::$app->getUser()->checkPermission(Metrix::MANAGE_SOURCE_CREDENTIALS_PERMISSION);
        $settingsSource = $canManageSourceCredentials ? $source : SourceSecurity::redactedSource($source);
        $settingsSourceInstances = array_map(
            static fn(SourceInterface $sourceInstance): SourceInterface => $canManageSourceCredentials
                ? $sourceInstance
                : SourceSecurity::redactedSource($sourceInstance),
            $sourceInstances,
        );

        return $this->renderTemplate('metrix/sources/_edit', [
            'title' => $title,
            'source' => $source,
            'sourceOptions' => $sourceOptions,
            'settingsSource' => $settingsSource,
            'settingsSourceInstances' => $settingsSourceInstances,
            'sourceTypes' => $allSourceTypes,
        ]);
    }

    public function actionSave(): ?Response
    {
        $this->requirePostRequest();

        $sourcesService = Metrix::$plugin->getSources();
        $sourceId = $this->request->getParam('sourceId') ?: null;
        $type = $this->request->getParam('type');
        $oldSource = null;
        $storedSource = null;

        if ($sourceId) {
            $oldSource = $sourcesService->getSourceById($sourceId);
            $storedSource = $sourcesService->getStoredSourceById($sourceId);

            if (!$oldSource || !$storedSource) {
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

        // Source identity is authorised by the request's source ID, not provider settings.
        $source->id = $sourceId ? (int)$sourceId : null;

        $canManageSourceCredentials = Craft::$app->getUser()->checkPermission(Metrix::MANAGE_SOURCE_CREDENTIALS_PERMISSION);
        $responseSource = $canManageSourceCredentials ? $source : SourceSecurity::redactedSource($source);
        $sourceToSave = $source;

        if ($oldSource && !$canManageSourceCredentials) {
            $sourceToSave = SourceSecurity::prepareDelegatedSource($source, $oldSource);
        }

        $validDelegatedChange = $this->_validateDelegatedSourceChange($sourceToSave, $oldSource);

        if (
            $oldSource
            && $storedSource
            && !$canManageSourceCredentials
            && $sourceToSave->handle !== $oldSource->handle
            && SourceSecurity::hasProtectedConfigurationOverrides($oldSource, $storedSource)
        ) {
            $sourceToSave->addError('handle', Craft::t('metrix', 'You do not have permission to rename a source with protected configuration overrides.'));
            $validDelegatedChange = false;
        }

        if (!$validDelegatedChange) {
            if ($responseSource !== $sourceToSave) {
                $responseSource->addErrors($sourceToSave->getErrors());
            }

            return $this->asModelFailure($responseSource, Craft::t('metrix', 'Couldn’t save source.'), 'source');
        }

        $settingsForPersistence = null;

        if ($storedSource && !$canManageSourceCredentials) {
            $settingsForPersistence = SourceSecurity::settingsForPersistence($sourceToSave, $storedSource);
        }

        if (!$sourcesService->saveSource($sourceToSave, true, $settingsForPersistence)) {
            if ($responseSource !== $sourceToSave) {
                $responseSource->addErrors($sourceToSave->getErrors());
            }

            return $this->asModelFailure($responseSource, Craft::t('metrix', 'Couldn’t save source.'), 'source');
        }

        $responseSource->id = $sourceToSave->id;

        return $this->asModelSuccess($responseSource, Craft::t('metrix', 'Source saved.'), 'source');
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

        $sourceId = $this->request->getBodyParam('sourceId') ?: $this->request->getRequiredBodyParam('id');

        Metrix::$plugin->getSources()->deleteSourceById($sourceId);

        return $this->asSuccess(Craft::t('metrix', 'Source deleted.'));
    }

    public function actionRefreshSettings(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $sourcesService = Metrix::$plugin->getSources();

        $sourceData = $this->request->getBodyParam('sourceData', []);
        $sourceHandle = $this->request->getRequiredBodyParam('source');
        $setting = $this->request->getRequiredBodyParam('setting');

        $source = $sourcesService->getSourceByHandle($sourceHandle);

        if (!$source) {
            throw new BadRequestHttpException("Invalid source: $sourceHandle");
        }

        if (!is_array($sourceData)) {
            throw new BadRequestHttpException('Invalid source settings.');
        }

        $originalSource = clone $source;
        $allowedAttributes = array_flip($source->settingsAttributes());

        // A refresh may overlay only provider settings; base model state and
        // config-owned values are not transient request inputs.
        $source->setAttributes(array_intersect_key($sourceData, $allowedAttributes), false);

        if (!Craft::$app->getUser()->checkPermission(Metrix::MANAGE_SOURCE_CREDENTIALS_PERMISSION)) {
            $source = SourceSecurity::prepareDelegatedSource($source, $originalSource);
        }

        if (!$this->_validateDelegatedSourceChange($source, $originalSource)) {
            return $this->asJson([
                'error' => implode(' ', $source->getErrorSummary(true)),
            ]);
        }

        return $this->asJson($source->getSourceSettings($setting, false));
    }

    public function actionCheckConnection(): Response
    {
        $this->requirePostRequest();
        $this->requirePermission(Metrix::MANAGE_SOURCE_CREDENTIALS_PERMISSION);

        $request = $this->request;
        $type = $request->getParam('type');
        $sourceId = $request->getParam('sourceId');

        if (!$sourceId) {
            return $this->asFailure(Craft::t('metrix', 'Unknown source: “{id}”', ['id' => $sourceId]));
        }

        $source = Metrix::$plugin->getSources()->getSourceById($sourceId);

        if (!$source) {
            return $this->asFailure(Craft::t('metrix', 'Unknown source: “{id}”', ['id' => $sourceId]));
        }

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


    // Private Methods
    // =========================================================================

    private function _validateDelegatedSourceChange(SourceInterface $source, ?SourceInterface $original): bool
    {
        if (Craft::$app->getUser()->checkPermission(Metrix::MANAGE_SOURCE_CREDENTIALS_PERMISSION)) {
            return $this->_validateCredentialSourceChange($source, $original);
        }

        return SourceSecurity::validateDelegatedChange($source, $original);
    }

    /**
     * Credential managers who aren't admins can enter credentials, but can't add environment variable references or
     * send credentials they can't see to a new endpoint or provider. Both sides are compared as the source runs,
     * including config overrides, because config wins over posted values and its credentials are hidden in the form.
     */
    private function _validateCredentialSourceChange(SourceInterface $source, ?SourceInterface $original): bool
    {
        $settings = $source->getSettings();
        $overrides = $source->handle ? Metrix::$plugin->getSources()->getSourceOverrides($source->handle) : [];
        $stored = array_merge($original?->getSettings() ?? [], $overrides);

        // Any saved reference counts as a credential, as ordinary settings such as a site ID are sent along with it.
        $credentials = array_keys(array_filter($stored, fn($value) => EnvironmentSettings::containsReference($value)));

        // Config credentials that aren't references are masked in the form, so they're hidden from this user too.
        if ($source instanceof CredentialSourceInterface) {
            $credentials = array_merge($credentials, array_intersect($source->getCredentialAttributes(), array_keys($overrides)));
        }

        // A setting the new provider doesn't have can't carry a saved credential over.
        $credentials = array_values(array_intersect(array_unique($credentials), array_keys($settings)));
        $destinations = $source instanceof CredentialsSource ? $source->getEndpointAttributes() : [];
        $providerChanged = $original && get_class($source) !== get_class($original);

        $violation = EnvironmentSettings::violation($settings, $stored, $credentials, true, $providerChanged, $destinations);

        if (!$violation) {
            return true;
        }

        $message = $violation->reason === EnvironmentSettingsViolation::REFERENCE
            ? Craft::t('metrix', 'Only admins can use environment variables here.')
            : Craft::t('metrix', 'Enter the credentials again after changing where this connects.');

        $source->addError($violation->getAttribute() ?? 'type', $message);

        return false;
    }
}
