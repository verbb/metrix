<?php
namespace verbb\metrix\base;

use verbb\metrix\Metrix;
use verbb\metrix\models\AnalyticsScope;

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
    public ?AnalyticsScope $scope = null;


    // Public Methods
    // =========================================================================

    public function getData(bool $refreshCache = false): array
    {
        $cacheDuration = Metrix::$plugin->getSettings()->getCacheDuration();
        $cacheKey = $this->getCacheKey();

        // Some widgets can define not to be cachable (realtime)
        if ($this->widget && !$this->widget::supportsCache()) {
            $cacheDuration = 1;
        }

        $cache = Craft::$app->getCache();

        if ($refreshCache) {
            $cache->delete($cacheKey);
        }

        $fromCache = false;
        $fetchedAt = time();
        $rawData = null;

        // Prefer an envelope that stores provider fetch time with the payload so
        // “Updated …” reflects freshness, not merely delivery time (Astra).
        if ($cacheDuration > 1 && !$refreshCache) {
            $cached = $cache->get($cacheKey);

            if ($cached !== false) {
                [$rawData, $fetchedAt] = $this->unwrapCacheEnvelope($cached);
                $fromCache = true;
            }
        }

        if ($rawData === null) {
            $rawData = $this->widget->fetchData($this);
            $fetchedAt = time();

            if ($cacheDuration > 1) {
                $cache->set(
                    $cacheKey,
                    [
                        'raw' => $rawData,
                        'fetchedAt' => $fetchedAt,
                    ],
                    $cacheDuration,
                    $this->getCacheDependency(),
                );
            }
        }

        // Always apply `formatData` to the cached raw data
        $formatted = $this->formatData(is_array($rawData) ? $rawData : []);

        return array_merge($formatted, [
            '_meta' => [
                'fetchedAt' => $fetchedAt,
                'fromCache' => $fromCache,
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
            $this->scope?->cacheKey() ?? 'scope:none',
            // Bump when envelope shape changes so legacy raw blobs are ignored.
            'v2',
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

        $view = $this->widget?->getView();

        if ($view?->id) {
            $tags[] = 'metrix.view.id.' . $view->id;
        }

        if ($view?->handle) {
            $tags[] = 'metrix.view.' . $view->handle;
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


    // Private Methods
    // =========================================================================

    /**
     * @return array{0: mixed, 1: int}
     */
    private function unwrapCacheEnvelope(mixed $cached): array
    {
        if (is_array($cached) && array_key_exists('raw', $cached) && array_key_exists('fetchedAt', $cached)) {
            return [$cached['raw'], (int)$cached['fetchedAt']];
        }

        // Legacy bare payload (pre-envelope) — treat as just-fetched for honesty.
        return [$cached, time()];
    }
}
