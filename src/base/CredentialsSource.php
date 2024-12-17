<?php
namespace verbb\metrix\base;

use Craft;
use craft\helpers\Json;

use GuzzleHttp\Client;

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

    public function isConfigured(): bool
    {
        return true;
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

        $success = $this->fetchConnection();

        if ($success) {
            $this->setSettingCache(['connection' => self::CONNECT_SUCCESS]);
        }

        return $success;
    }

    public function request(string $method, string $url, array $options = []): mixed
    {
        try {
            $client = $this->getClient();
            $response = $client->request($method, $url, $options);

            return Json::decode($response->getBody()->getContents(), true);
        } catch (Throwable $e) {
            throw $e;
        }
    }
}