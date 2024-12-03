<?php
namespace verbb\metrix\base;

use verbb\metrix\Metrix;

use Craft;
use craft\base\SavableComponent;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\validators\HandleValidator;

use verbb\auth\helpers\Provider as ProviderHelper;

use DateTime;
use Exception;

use GuzzleHttp\Exception\RequestException;

abstract class Source extends SavableComponent implements SourceInterface
{
    // Static Methods
    // =========================================================================

    public static function apiError($source, $exception, $throwError = true): void
    {
        $messageText = $exception->getMessage();

        // Check for Guzzle errors, which are truncated in the exception `getMessage()`.
        if ($exception instanceof RequestException && $exception->getResponse()) {
            $messageText = (string)$exception->getResponse()->getBody();
        }

        $message = Craft::t('metrix', 'API error: “{message}” {file}:{line}', [
            'message' => $messageText,
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
        ]);

        Metrix::error($source->name . ': ' . $message);

        if ($throwError) {
            throw new Exception($message);
        }
    }


    // Properties
    // =========================================================================

    public ?string $name = null;
    public ?string $handle = null;
    public ?bool $enabled = null;
    public ?int $sortOrder = null;
    public ?string $uid = null;

    // Set via config files
    public array $authorizationOptions = [];
    public array $scopes = [];


    // Abstract Methods
    // =========================================================================

    abstract public static function getOAuthProviderClass(): string;


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

    public function isConnected(): bool
    {
        return false;
    }

    public function getSettingsHtml(): ?string
    {
        $handle = StringHelper::toKebabCase(static::$providerHandle);

        return Craft::$app->getView()->renderTemplate('metrix/sources/_types/' . $handle . '/settings', [
            'source' => $this,
        ]);
    }
}
