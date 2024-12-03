<?php
namespace verbb\metrix\base;

use craft\base\SavableComponentInterface;

interface SourceInterface extends SavableComponentInterface
{
    // Public Methods
    // =========================================================================

    public static function getOAuthProviderClass(): string;

}
