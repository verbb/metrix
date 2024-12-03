<?php
namespace verbb\metrix\sources;

use verbb\metrix\base\Source;

use Craft;
use craft\base\MissingComponentInterface;
use craft\base\MissingComponentTrait;

use yii\base\NotSupportedException;

class MissingSource extends Source implements MissingComponentInterface
{
    // Traits
    // =========================================================================

    use MissingComponentTrait;


    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Missing Source');
    }

    public static function getOAuthProviderClass(): string
    {
        throw new NotSupportedException('getOAuthProviderClass() is not implemented.');
    }


    // Properties
    // =========================================================================

    public static string $providerHandle = 'missingSource';
}
