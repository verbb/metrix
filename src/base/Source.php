<?php
namespace verbb\metrix\base;

use verbb\metrix\Metrix;
use verbb\metrix\helpers\Canonical;

use Craft;
use craft\base\SavableComponent;
use craft\helpers\Db;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\helpers\UrlHelper;
use craft\validators\HandleValidator;

use verbb\auth\helpers\Provider as ProviderHelper;

use DateTime;
use Exception;
use Throwable;

use GuzzleHttp\Exception\RequestException;

abstract class Source extends SavableComponent implements SourceInterface
{
    // Static Methods
    // =========================================================================

    public static function supportsOAuthConnection(): bool
    {
        return false;
    }

    public static function supportsConnection(): bool
    {
        return false;
    }

    public static function apiError($source, $exception, $throwError = true): void
    {
        $messageText = self::formatExceptionMessage($exception);

        $message = Craft::t('metrix', 'API error: “{message}” {file}:{line}', [
            'message' => $messageText,
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
        ]);

        Metrix::error($source->name . ': ' . $message);
        Metrix::error($exception->getTraceAsString());

        if ($throwError) {
            throw new Exception($message, (int)$exception->getCode(), $exception);
        }
    }

    /**
     * Prefer the full HTTP response body over Guzzle's truncated getMessage() summary.
     */
    public static function formatExceptionMessage(Throwable $exception): string
    {
        $requestException = self::findRequestException($exception);

        if ($requestException && ($response = $requestException->getResponse())) {
            $body = $response->getBody();

            if ($body->isSeekable()) {
                $body->rewind();
            }

            $responseBody = trim((string)$body);

            if ($responseBody !== '') {
                $decoded = Json::decodeIfJson($responseBody);
                $prettyBody = is_array($decoded)
                    ? Json::encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
                    : $responseBody;

                $request = $requestException->getRequest();
                $status = $response->getStatusCode() . ' ' . $response->getReasonPhrase();

                return sprintf(
                    "%s %s resulted in %s:\n%s",
                    $request->getMethod(),
                    (string)$request->getUri(),
                    $status,
                    $prettyBody
                );
            }
        }

        return $exception->getMessage();
    }

    private static function findRequestException(Throwable $exception): ?RequestException
    {
        $current = $exception;

        // Walk the full previous chain — Auth/League often wrap the Guzzle exception.
        while ($current) {
            if ($current instanceof RequestException) {
                return $current;
            }

            $current = $current->getPrevious();
        }

        return null;
    }


    // Properties
    // =========================================================================

    public ?string $name = null;
    public ?string $handle = null;
    public ?bool $enabled = null;
    public ?int $sortOrder = null;
    public array $cache = [];
    public ?string $uid = null;

    // Set via config files
    public array $authorizationOptions = [];
    public array $scopes = [];


    // Public Methods
    // =========================================================================

    public function defineRules(): array
    {
        $rules = parent::defineRules();

        $rules[] = [['name', 'handle'], 'required'];
        $rules[] = [['id'], 'number', 'integerOnly' => true];

        $rules[] = [
            ['handle'],
            HandleValidator::class,
            'reservedWords' => [
                'dateCreated',
                'dateUpdated',
                'edit',
                'id',
                'title',
                'uid',
            ],
        ];

        return $rules;
    }

    public function getProviderName(): string
    {
        return static::displayName();
    }

    public function getProviderHandle(): string
    {
        return static::$providerHandle;
    }

    public function getPrimaryColor(): ?string
    {
        return ProviderHelper::getPrimaryColor(static::$providerHandle);
    }

    public function getIcon(): ?string
    {
        return ProviderHelper::getIcon(static::$providerHandle);
    }

    public function getCpEditUrl(): ?string
    {
        return UrlHelper::cpUrl('metrix/sources/' . $this->handle);
    }

    public function isConnected(): bool
    {
        return false;
    }

    public function getSettingsHtml(): ?string
    {
        $handle = StringHelper::toKebabCase(static::$providerHandle);

        return Craft::$app->getView()->renderTemplate('metrix/sources/_types/' . $handle . '/settings', [
            'source' => $this,
            'fieldVariables' => [
                'plugin' => 'metrix',
                'name' => $this::displayName(),
            ],
        ]);
    }

    public function getSourceSettings(string $settingsKey, bool $useCache = true): ?array
    {
        if ($useCache) {
            // Return even if empty, we don't want to force setting the value unless told to
            return $this->getSettingCache($settingsKey);
        }

        $settings = $this->fetchSourceSettings($settingsKey);

        if ($settings) {
            $this->setSettingCache([$settingsKey => $settings]);
        }

        return $settings;
    }

    public function fetchSourceSettings(string $settingsKey): ?array
    {
        return [];
    }

    public function getCacheKey(): string
    {
        $settings = $this->getSettings();
        unset($settings['clientId'], $settings['clientSecret']);

        return md5(Json::encode($settings));
    }

    public function supportsRealtime(): bool
    {
        return method_exists($this, 'fetchRealtimeData');
    }

    public function resolveCanonicalMetric(string $key): ?string
    {
        return $this->getCanonicalMetricMap()[$key] ?? null;
    }

    public function resolveCanonicalDimension(string $key): ?string
    {
        return $this->getCanonicalDimensionMap()[$key] ?? null;
    }

    public function getAvailableMetrics(): array
    {
        return Canonical::mergeGroupedPropertyOptions(
            $this,
            $this->fetchAvailableMetrics(),
            'metrics',
        );
    }

    public function getAvailableDimensions(): array
    {
        return Canonical::mergeGroupedPropertyOptions(
            $this,
            $this->fetchAvailableDimensions(),
            'dimensions',
        );
    }

    public function fetchAvailableMetrics(): array
    {
        return [];
    }

    public function fetchAvailableDimensions(): array
    {
        return [];
    }


    // Protected Methods
    // =========================================================================

    protected function setSettingCache(array $values): void
    {
        $this->cache = array_merge($this->cache, $values);

        $data = Json::encode($this->cache);

        // Direct DB update to keep it out of PC, plus speed
        Db::update('{{%metrix_sources}}', ['cache' => $data], ['id' => $this->id]);
    }

    protected function getSettingCache(string $key): mixed
    {
        return $this->cache[$key] ?? null;
    }

    /**
     * Map curated canonical metric keys to this provider's native API values.
     *
     * @return array<string, string>
     */
    protected function getCanonicalMetricMap(): array
    {
        return [];
    }

    /**
     * Map curated canonical dimension keys to this provider's native API values.
     *
     * @return array<string, string>
     */
    protected function getCanonicalDimensionMap(): array
    {
        return [];
    }
}
