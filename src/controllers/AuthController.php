<?php
namespace verbb\metrix\controllers;

use verbb\metrix\Metrix;

use Craft;
use craft\elements\User;
use craft\web\Controller;

use yii\web\Response;

use Throwable;

use verbb\auth\Auth;
use verbb\auth\helpers\Session;

class AuthController extends Controller
{
    // Properties
    // =========================================================================

    // Only the OAuth provider callback is anonymous — connect/disconnect require CP auth.
    protected array|int|bool $allowAnonymous = ['callback'];


    // Public Methods
    // =========================================================================

    public function beforeAction($action): bool
    {
        // Don't require CSRF validation for callback requests
        if ($action->id === 'callback') {
            $this->enableCsrfValidation = false;
        }

        return parent::beforeAction($action);
    }

    public function actionConnect(): ?Response
    {
        $this->requirePermission('metrix-sources');
        $this->requirePermission(Metrix::MANAGE_SOURCE_CREDENTIALS_PERMISSION);
        $this->requirePostRequest();

        $sourceHandle = $this->request->getRequiredParam('source');

        try {
            if (!($source = Metrix::$plugin->getSources()->getSourceByHandle($sourceHandle))) {
                return $this->asFailure(Craft::t('metrix', 'Unable to find source “{source}”.', ['source' => $sourceHandle]));
            }

            $context = [
                'sourceHandle' => $sourceHandle,
            ];

            if ($this->request->getIsCpRequest()) {
                if ($redirect = $this->request->getValidatedBodyParam('redirect')) {
                    $context['redirect'] = $this->getView()->renderObjectTemplate($redirect, $source);
                }
            }

            return Auth::getInstance()->getOAuth()->connect('metrix', $source, $source->id, $context);
        } catch (Throwable $e) {
            Metrix::error('Unable to authorize connect “{source}”: “{message}” {file}:{line}', [
                'source' => $sourceHandle,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            Metrix::error($e);

            return $this->asFailure(Craft::t('metrix', 'Unable to authorize connect “{source}”.', ['source' => $sourceHandle]));
        }
    }

    public function actionCallback(): ?Response
    {
        $oauth = Auth::getInstance()->getOAuth();

        if ($response = $oauth->prepareCallback('metrix')) {
            return $response;
        }

        $oauth->claimAuthorizedCallback(
            'metrix',
            fn(User $user): bool => $user->can('metrix-sources') && $user->can(Metrix::MANAGE_SOURCE_CREDENTIALS_PERMISSION),
        );

        // Get both the origin (failure) and redirect (success) URLs
        $origin = Session::get('origin');
        $redirect = Session::get('redirect');

        // Get the source we're current authorizing
        if (!($sourceHandle = Session::get('sourceHandle'))) {
            Session::setError('metrix', Craft::t('metrix', 'Unable to find source.'), true);

            return $this->redirect($origin);
        }

        if (!($source = Metrix::$plugin->getSources()->getSourceByHandle($sourceHandle))) {
            Session::setError('metrix', Craft::t('metrix', 'Unable to find source “{source}”.', ['source' => $sourceHandle]), true);

            return $this->redirect($origin);
        }

        try {
            // Fetch the access token from the source and create a Token for us to use
            $token = $oauth->callback('metrix', $source, $source->id);

            if (!$token) {
                Session::setError('metrix', Craft::t('metrix', 'Unable to fetch token.'), true);

                return $this->redirect($origin);
            }

            // Save the token to the Auth plugin, with a reference to this source
            $token->reference = $source->id;
            Auth::getInstance()->getTokens()->upsertToken($token);

            Metrix::$plugin->getSources()->invalidateWidgetDataCache($source);
        } catch (Throwable $e) {
            $error = Craft::t('metrix', 'Unable to process callback for “{source}”: “{message}” {file}:{line}', [
                'source' => $sourceHandle,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            Metrix::error($error);
            Metrix::error($e);

            // Show the error detail in the CP
            Craft::$app->getSession()->setFlash('metrix:callback-error', $error);

            return $this->redirect($origin);
        }

        Session::setNotice('metrix', Craft::t('metrix', '{provider} connected.', ['provider' => $source->providerName]), true);

        return $this->redirect($redirect);
    }

    public function actionDisconnect(): ?Response
    {
        $this->requirePermission('metrix-sources');
        $this->requirePermission(Metrix::MANAGE_SOURCE_CREDENTIALS_PERMISSION);
        $this->requirePostRequest();

        $sourceHandle = $this->request->getRequiredParam('source');

        if (!($source = Metrix::$plugin->getSources()->getSourceByHandle($sourceHandle))) {
            return $this->asFailure(Craft::t('metrix', 'Unable to find source “{source}”.', ['source' => $sourceHandle]));
        }

        // Delete all tokens for this source
        Auth::getInstance()->getTokens()->deleteTokenByOwnerReference('metrix', $source->id);

        Metrix::$plugin->getSources()->invalidateWidgetDataCache($source);

        return $this->asModelSuccess($source, Craft::t('metrix', '{provider} disconnected.', ['provider' => $source->providerName]), 'source');
    }

}
