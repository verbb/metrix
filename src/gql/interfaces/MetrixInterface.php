<?php
namespace verbb\metrix\gql\interfaces;

use verbb\metrix\gql\arguments\SourceArguments;
use verbb\metrix\gql\resolvers\SourceResolver;
use verbb\metrix\gql\types\generators\MetrixGenerator;

use craft\gql\base\InterfaceType as BaseInterfaceType;
use craft\gql\GqlEntityRegistry;

use GraphQL\Type\Definition\InterfaceType;
use GraphQL\Type\Definition\Type;

class MetrixInterface extends BaseInterfaceType
{
    // Static Methods
    // =========================================================================

    public static function getTypeGenerator(): string
    {
        return MetrixGenerator::class;
    }

    public static function getType($fields = null): Type
    {
        if ($type = GqlEntityRegistry::getEntity(self::class)) {
            return $type;
        }

        $type = GqlEntityRegistry::createEntity(self::class, new InterfaceType([
            'name' => static::getName(),
            'fields' => self::class . '::getFieldDefinitions',
            'description' => 'This is the interface implemented by Metrix.',
            'resolveType' => function (array $value) {
                return GqlEntityRegistry::getEntity(MetrixGenerator::getName());
            },
        ]));

        MetrixGenerator::generateTypes();

        return $type;
    }

    public static function getName(): string
    {
        return 'MetrixInterface';
    }

    public static function getFieldDefinitions(): array
    {
        return [
            'sources' => [
                'name' => 'sources',
                'args' => SourceArguments::getArguments(),
                'type' => Type::listOf(SourceInterface::getType()),
                'resolve' => SourceResolver::class . '::resolve',
                'description' => 'All Metrix sources.',
            ],
            'source' => [
                'name' => 'source',
                'args' => SourceArguments::getArguments(),
                'type' => SourceInterface::getType(),
                'resolve' => SourceResolver::class . '::resolveOne',
                'description' => 'A single Metrix source.',
            ],
        ];
    }
}
