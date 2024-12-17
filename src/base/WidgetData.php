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

        // Some widgets can define not to be cachable (realtime)
        if ($this->widget && !$this->widget::supportsCache()) {
            $cacheDuration = 1;
        }

        // Retrieve raw API data from the cache
        $rawData = Craft::$app->getCache()->getOrSet($cacheKey, function() {
            return $this->widget->fetchData($this);
        }, $cacheDuration);

        // Always apply `formatData` to the cached raw data
        return $this->formatData($rawData);
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
