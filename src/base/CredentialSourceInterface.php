<?php
namespace verbb\metrix\base;

interface CredentialSourceInterface extends SourceInterface
{
    // Public Methods
    // =========================================================================

    public function getCredentialAttributes(): array;
}
