<?php
namespace verbb\metrix\base;

use verbb\metrix\Metrix;

use Craft;
use craft\base\Model;

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

    public function getData(bool $refreshCache = false): array
    {
        $cacheDuration = Metrix::$plugin->getSettings()->getCacheDuration();
        $cacheKey = $this->getCacheKey();
        $fetchedAt = time();

        // Some widgets can define not to be cachable (realtime)
        if ($this->widget && !$this->widget::supportsCache()) {
            $cacheDuration = 1;
        }

        $cache = Craft::$app->getCache();

        if ($refreshCache) {
            $cache->delete($cacheKey);
        }

        $fromCache = $cacheDuration > 1 && $cache->exists($cacheKey);

        // Retrieve raw API data from the cache
        $rawData = $cache->getOrSet($cacheKey, function() {
            return $this->widget->fetchData($this);
        }, $cacheDuration);

        // Always apply `formatData` to the cached raw data
        $formatted = $this->formatData($rawData);

        return array_merge($formatted, [
            '_meta' => [
                'fetchedAt' => $fetchedAt,
                'fromCache' => $fromCache && !$refreshCache,
            ],
        ]);
    }

    public function clearCache(): void
    {
        Craft::$app->getCache()->delete($this->getCacheKey());
    }

    public function getCacheKey(string $suffix = ''): string
    {
        $cacheKey = [
            'metrix',
            get_class($this->widget),
            $this->source?->handle,
            $this->source?->getCacheKey(),
            $this->metric,
            $this->dimension,
            $this->period,
        ];

        if ($suffix !== '') {
            $cacheKey[] = $suffix;
        }

        return implode('.', $cacheKey);
    }


    // Protected Methods
    // =========================================================================

    protected function formatData(array $rawData): array
    {
        return $rawData;
    }
}
