<?php
namespace verbb\metrix\gql\types\generators;

use verbb\metrix\gql\arguments\MetrixArguments;
use verbb\metrix\gql\interfaces\MetrixInterface;
use verbb\metrix\gql\types\MetrixType;

use craft\gql\base\GeneratorInterface;
use craft\gql\GqlEntityRegistry;

class MetrixGenerator implements GeneratorInterface
{
    // Static Methods
    // =========================================================================

    public static function generateTypes(mixed $context = null): array
    {
        $gqlTypes = [];

        $typeName = self::getName();
        $metrixFields = MetrixInterface::getFieldDefinitions();
        $metrixArgs = MetrixArguments::getArguments();
        
        $gqlTypes[$typeName] = GqlEntityRegistry::getEntity($typeName) ?: GqlEntityRegistry::createEntity($typeName, new MetrixType([
            'name' => $typeName,
            'args' => function() use ($metrixArgs) {
                return $metrixArgs;
            },
            'fields' => function() use ($metrixFields) {
                return $metrixFields;
            },
        ]));

        return $gqlTypes;
    }

    public static function getName($context = null): string
    {
        return 'MetrixType';
    }
}
