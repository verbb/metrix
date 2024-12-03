<?php
namespace verbb\metrix\variables;

use verbb\metrix\Metrix;
use verbb\metrix\base\SourceInterface;

class MetrixVariable
{
    // Public Methods
    // =========================================================================

    public function getPlugin(): Metrix
    {
        return Metrix::$plugin;
    }

    public function getPluginName(): string
    {
        return Metrix::$plugin->getPluginName();
    }

    public function getAllSources(): array
    {
        return Metrix::$plugin->getSources()->getAllSources();
    }

    public function getAllEnabledSources(): array
    {
        return Metrix::$plugin->getSources()->getAllEnabledSources();
    }

    public function getAllConfiguredSources(): array
    {
        return Metrix::$plugin->getSources()->getAllConfiguredSources();
    }

    public function getSourceById(int $id): ?SourceInterface
    {
        return Metrix::$plugin->getSources()->getSourceById($id);
    }

    public function getSourceByHandle(string $handle): ?SourceInterface
    {
        return Metrix::$plugin->getSources()->getSourceByHandle($handle);
    }
    
}