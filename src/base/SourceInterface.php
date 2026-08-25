<?php
namespace verbb\metrix\base;

use verbb\metrix\models\AnalyticsScope;

use craft\base\SavableComponentInterface;

interface SourceInterface extends SavableComponentInterface
{
    /**
     * Compact capability flags for schema/UI gating (realtime, dimensions, etc.).
     *
     * @return array{realtime: bool, dimensions: bool, connection: bool, oauth: bool, analyticsScope: bool}
     */
    public function getCapabilities(): array;

    public function supportsRealtime(): bool;

    public function supportsDimensions(): bool;

    /**
     * Whether this source can apply View analytics scope (path/hostname filters).
     */
    public function supportsAnalyticsScope(): bool;

    /**
     * Mutate a provider request payload/query to honour the View scope.
     *
     * @param array<string, mixed> $request
     */
    public function applyAnalyticsScope(array &$request, AnalyticsScope $scope): void;
}
