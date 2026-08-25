<?php
namespace verbb\metrix\base;

use craft\base\SavableComponentInterface;

interface SourceInterface extends SavableComponentInterface
{
    /**
     * Compact capability flags for schema/UI gating (realtime, dimensions, etc.).
     *
     * @return array{realtime: bool, dimensions: bool, connection: bool, oauth: bool}
     */
    public function getCapabilities(): array;

    public function supportsRealtime(): bool;

    public function supportsDimensions(): bool;
}
