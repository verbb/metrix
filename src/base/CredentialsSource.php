<?php
namespace verbb\metrix\base;

use Craft;
use craft\helpers\App;
use craft\helpers\Json;

use GuzzleHttp\Client;
use GuzzleHttp\RequestOptions;

abstract class CredentialsSource extends Source
{
    // Static Methods
    // =========================================================================

    public static function supportsConnection(): bool
    {
        return true;
    }


    // Constants
    // =========================================================================

    public const CONNECT_SUCCESS = 'success';


    // Properties
    // =========================================================================

    protected ?Client $_client = null;


    // Abstract Methods
    // =========================================================================

    abstract public function getClient(): Client;


    // Public Methods
    // =========================================================================

    public function fetchConnection(): bool
    {
        return true;
    }

    /**
     * Settings which determine where credentials are sent.
     */
    public function getEndpointAttributes(): array
    {
        return [];
    }

    public function isConfigured(): bool
    {
        // Validate resolved settings without replacing stored environment references or form errors.
        $source = clone $this;
        $source->enabled = true;
        $attributes = $source->settingsAttributes();

        foreach ($attributes as $attribute) {
            if (is_string($source->$attribute)) {
                $source->$attribute = App::parseEnv($source->$attribute) ?? '';
            }
        }

        return $source->validate($attributes);
    }

    public function isConnected(): bool
    {
        return $this->getSettingCache('connection') === self::CONNECT_SUCCESS;
    }

    public function checkConnection(bool $useCache = true): bool
    {
        if ($useCache && $status = $this->getSettingCache('connection')) {
            if ($status === self::CONNECT_SUCCESS) {
                return true;
            }
        }

        $success = false;

        try {
            $success = $this->fetchConnection();

            return $success;
        } finally {
            $this->setSettingCache(['connection' => $success ? self::CONNECT_SUCCESS : null]);
        }
    }

    public function request(string $method, string $url, array $options = []): mixed
    {
        try {
            $client = $this->getClient();
            // Provider redirects must never move credentials away from the
            // origin which was validated and pinned when the client was built.
            $options[RequestOptions::ALLOW_REDIRECTS] = false;
            // A proxy would resolve HTTPS CONNECT targets itself, bypassing
            // the local DNS validation and CURLOPT_RESOLVE pinning.
            $options[RequestOptions::PROXY] = null;
            $response = $client->request($method, $url, $options);

            return Json::decode($response->getBody()->getContents(), true);
        } catch (Throwable $e) {
            throw $e;
        }
    }
}
