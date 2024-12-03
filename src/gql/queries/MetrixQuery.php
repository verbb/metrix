<?php
namespace verbb\metrix\gql\queries;

use verbb\metrix\gql\arguments\MetrixArguments;
use verbb\metrix\gql\interfaces\MetrixInterface;
use verbb\metrix\gql\resolvers\MetrixResolver;
use verbb\metrix\helpers\Gql as GqlHelper;

use craft\gql\base\Query;

class MetrixQuery extends Query
{
    // Static Methods
    // =========================================================================

    public static function getQueries($checkToken = true): array
    {
        if ($checkToken && !GqlHelper::canQueryMetrix()) {
            return [];
        }

        return [
            'metrix' => [
                'type' => MetrixInterface::getType(),
                'args' => MetrixArguments::getArguments(),
                'resolve' => MetrixResolver::class . '::resolve',
                'description' => 'This query is used to query for Metrix content.'
            ],
        ];
    }
}
