<?php
namespace verbb\metrix\gql\resolvers;

use verbb\metrix\Metrix;

use craft\gql\base\Resolver;

use Exception;

use GraphQL\Type\Definition\ResolveInfo;

class SourceResolver extends Resolver
{
    // Static Methods
    // =========================================================================

    public static function resolve($source, array $arguments, $context, ResolveInfo $resolveInfo): mixed
    {
        return Metrix::$plugin->getSources()->getAllSourcesByParams($arguments);
    }

    public static function resolveOne($source, array $arguments, $context, ResolveInfo $resolveInfo): mixed
    {
        if (!array_key_exists('id', $arguments) && !array_key_exists('handle', $arguments) && !array_key_exists('uid', $arguments)) {
            throw new Exception('You must provide at least one identifier (`id`, `handle`, `uid`) argument to query a `source`.');
        }

        return Metrix::$plugin->getSources()->getSourceByParams($arguments);
    }
}
