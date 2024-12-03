<?php
namespace verbb\metrix\helpers;

use craft\helpers\Gql as GqlHelper;

class Gql extends GqlHelper
{
    // Public Methods
    // =========================================================================

    public static function canQueryMetrix(): bool
    {
        $allowedEntities = self::extractAllowedEntitiesFromSchema();

        return isset($allowedEntities['metrix']);
    }
}