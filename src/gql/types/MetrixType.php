<?php
namespace verbb\metrix\gql\types;

use verbb\metrix\gql\interfaces\MetrixInterface;

use craft\gql\base\ObjectType;

class MetrixType extends ObjectType
{
    // Public Methods
    // =========================================================================

    public function __construct(array $config)
    {
        $config['interfaces'] = [
            MetrixInterface::getType(),
        ];

        parent::__construct($config);
    }
}
