<?php
namespace verbb\metrix\sources;

use verbb\metrix\Metrix;
use verbb\metrix\base\OAuthSource;

use Craft;
use craft\helpers\App;

use Throwable;

use verbb\auth\providers\Google as GoogleProvider;

class GoogleAnalytics extends OAuthSource
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Google Analytics');
    }

    public static function getOAuthProviderClass(): string
    {
        return GoogleProvider::class;
    }


    // Properties
    // =========================================================================

    public static string $providerHandle = 'googleAnalytics';

    public ?string $proxyRedirect = null;


    // Public Methods
    // =========================================================================

    public function getProxyRedirect(): ?bool
    {
        return App::parseBooleanEnv($this->proxyRedirect);
    }

    public function getRedirectUri(): ?string
    {
        $uri = parent::getRedirectUri();

        // Allow a proxy to our server to forward on the request - just for local dev ease
        if ($this->getProxyRedirect()) {
            return "https://proxy.verbb.io?return=$uri";
        }

        return $uri;
    }

    public function getDefaultScopes(): array
    {
        return [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/analytics',
            'https://www.googleapis.com/auth/analytics.edit',
        ];
    }

    public function getAuthorizationUrlOptions(): array
    {
        $options = parent::getAuthorizationUrlOptions();
        $options['access_type'] = 'offline';
        $options['prompt'] = 'consent';
        
        return $options;
    }
}
