<?php
namespace verbb\metrix\base;

use verbb\metrix\Metrix;

use Craft;
use craft\base\Model;

use yii\caching\TagDependency;

class WidgetData extends Model implements WidgetDataInterface
{
    // Properties
    // =========================================================================

    public ?WidgetInterface $widget = null;
    public ?SourceInterface $source = null;
    public ?string $period = null;
    public ?string $metric = null;
    public ?string $dimension = null;
    public ?int $limit = null;


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

        // Tag so source save/reconnect can bust all related widget entries.
        $rawData = $cache->getOrSet(
            $cacheKey,
            function() {
                return $this->widget->fetchData($this);
            },
            $cacheDuration,
            $this->getCacheDependency(),
        );

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
            $this->getRowLimit(),
        ];

        if ($suffix !== '') {
            $cacheKey[] = $suffix;
        }

        return implode('.', $cacheKey);
    }

    public function getRowLimit(): int
    {
        if ($this->limit !== null && $this->limit > 0) {
            return min((int)$this->limit, 500);
        }

        return $this->widget?->getRowLimit() ?? 10;
    }

    /**
     * @return string[]
     */
    public function getCacheTags(): array
    {
        $tags = ['metrix'];

        if ($this->source?->handle) {
            $tags[] = 'metrix.source.' . $this->source->handle;
        }

        if ($this->source?->id) {
            $tags[] = 'metrix.source.id.' . $this->source->id;
        }

        return $tags;
    }

    public function getCacheDependency(): TagDependency
    {
        return new TagDependency(['tags' => $this->getCacheTags()]);
    }

    /**
     * Cache a related fetch (e.g. previous-period) under the same source tags.
     */
    public function remember(string $suffix, callable $callback, ?int $duration = null): mixed
    {
        $duration ??= Metrix::$plugin->getSettings()->getCacheDuration();

        return Craft::$app->getCache()->getOrSet(
            $this->getCacheKey($suffix),
            $callback,
            $duration,
            $this->getCacheDependency(),
        );
    }


    // Protected Methods
    // =========================================================================

    protected function formatData(array $rawData): array
    {
        return $rawData;
    }
}
