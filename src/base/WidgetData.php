<?php
namespace verbb\metrix\base;

use verbb\metrix\Metrix;

use Craft;
use craft\base\Model;

use Exception;

class WidgetData extends Model implements WidgetDataInterface
{
    // Properties
    // =========================================================================

    public ?WidgetInterface $widget = null;
    public ?SourceInterface $source = null;
    public ?string $period = null;
    public ?string $metric = null;
    public ?string $dimension = null;


    // Public Methods
    // =========================================================================

    public function getData(): array
    {
        $cacheDuration = Metrix::$plugin->getSettings()->getCacheDuration();
        $cacheKey = $this->_getCacheKey();

        // Attempt to retrieve cached data
        return Craft::$app->getCache()->getOrSet($cacheKey, function() {
            $rawData = $this->source->fetchData($this);

            return $this->formatData($rawData);
        }, $cacheDuration);
    }

    public function clearCache(): void
    {
        $cacheKey = $this->_getCacheKey();

        Craft::$app->getCache()->delete($cacheKey);
    }


    // Protected Methods
    // =========================================================================

    protected function formatData(array $rawData): array
    {
        return $rawData;
    }


    // Private Methods
    // =========================================================================

    private function _getCacheKey(): string
    {
        $cacheKey = [
            'metrix',
            get_class($this->widget),
            $this->source?->handle,
            $this->metric,
            $this->dimension,
            $this->period,
        ];

        return implode('.', $cacheKey);
    }
    
}
