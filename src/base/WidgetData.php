<?php
namespace verbb\metrix\base;

use verbb\metrix\Metrix;
use verbb\metrix\helpers\Canonical;
use verbb\metrix\models\AnalyticsScope;

use Craft;
use craft\base\Model;

use yii\caching\TagDependency;

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
    public ?int $limit = null;
    public ?AnalyticsScope $scope = null;

    protected bool $refreshCache = false;


    // Public Methods
    // =========================================================================

    public function getData(bool $refreshCache = false): array
    {
        if ($this->scope?->mode === AnalyticsScope::MODE_CRAFT_SITE && !$this->scope->getCraftSite()) {
            throw new Exception(Craft::t('metrix', 'The view’s Craft site is unavailable. Edit the view to select an existing site.'));
        }

        $this->refreshCache = $refreshCache;
        $requestStartedAt = microtime(true);
        $cacheDuration = Metrix::$plugin->getSettings()->getCacheDuration();
        $cacheKey = $this->getCacheKey();

        // Some widgets can define not to be cachable (realtime)
        if ($this->widget && !$this->widget::supportsCache()) {
            $cacheDuration = 1;
        }

        $usesPersistentCache = $cacheDuration > 1;

        $cache = Craft::$app->getCache();

        $fromCache = false;
        $fetchedAt = time();
        $rawData = null;

        // Prefer an envelope that stores provider fetch time with the payload so
        // “Updated …” reflects freshness, not merely delivery time (Astra).
        if ($usesPersistentCache && !$refreshCache) {
            $cached = $cache->get($cacheKey);

            if ($cached !== false) {
                [$rawData, $fetchedAt] = $this->_unwrapCacheEnvelope($cached);
                $fromCache = true;
            }
        }

        if ($rawData === null) {
            $mutex = Craft::$app->getMutex();
            $mutexName = 'metrix:widget-data:' . hash('sha256', serialize($cacheKey));
            $hasLock = $mutex->acquire($mutexName, 10);

            try {
                if (!$hasLock) {
                    $cached = $cache->get($cacheKey);

                    if ($cached !== false) {
                        [$cachedData, $cachedAt, $generatedAt] = $this->_unwrapCacheEnvelope($cached);

                        if ($usesPersistentCache || $generatedAt >= $requestStartedAt) {
                            $rawData = $cachedData;
                            $fetchedAt = $cachedAt;
                            $fromCache = true;
                        }
                    }

                    if ($rawData === null) {
                        throw new Exception(Craft::t('metrix', 'The widget data is already being refreshed. Please try again.'));
                    }
                }

                // A refresh follower accepts the generation produced after its
                // request began, coalescing concurrent refreshes into one fetch.
                if ($hasLock) {
                    $cached = $cache->get($cacheKey);

                    if ($cached !== false) {
                        [$cachedData, $cachedAt, $generatedAt] = $this->_unwrapCacheEnvelope($cached);

                        if (($usesPersistentCache && !$refreshCache) || $generatedAt >= $requestStartedAt) {
                            $rawData = $cachedData;
                            $fetchedAt = $cachedAt;
                            $fromCache = true;
                        }
                    }
                }

                if ($rawData === null) {
                    $rawData = $this->widget->fetchData($this);
                    $fetchedAt = time();

                    // Even when persistent caching is disabled, retain a
                    // one-second coordination envelope for concurrent followers.
                    $cache->set(
                        $cacheKey,
                        [
                            'raw' => $rawData,
                            'fetchedAt' => $fetchedAt,
                            'generatedAt' => microtime(true),
                        ],
                        max(1, $cacheDuration),
                        $this->getCacheDependency(),
                    );
                }
            } finally {
                if ($hasLock) {
                    $mutex->release($mutexName);
                }
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
        $range = $this->period ? $this->period::getCurrentDateRange() : [];
        // Rolling periods must expire at calendar boundaries without bypassing the TTL every second.
        $calendarRange = array_map(fn($date) => $date->format('Y-m-d e'), $range);

        $cacheKey = [
            'metrix',
            get_class($this->widget),
            $this->source?->handle,
            $this->source?->getCacheKey(),
            $this->metric,
            $this->dimension,
            $this->period,
            hash('sha256', serialize($calendarRange)),
            $this->getRowLimit(),
            $this->scope?->cacheKey() ?? 'scope:none',
            // Provider rate values are normalized before caching.
            'v3',
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

        // Related queries must honour the same cache policy as the main payload.
        if ($duration <= 1) {
            return $callback();
        }

        if ($this->refreshCache) {
            Craft::$app->getCache()->delete($this->getCacheKey($suffix));
        }

        return Craft::$app->getCache()->getOrSet(
            $this->getCacheKey($suffix),
            $callback,
            $duration,
            $this->getCacheDependency(),
        );
    }


    // Protected Methods
    // =========================================================================

    protected function getMetricFormat(string $default): string
    {
        if ($this->source && $this->metric !== null) {
            foreach (Canonical::getMetrics() as $key => $definition) {
                if ($this->source->resolveCanonicalMetric($key) === $this->metric
                    && in_array($definition['type'], ['percentage', 'duration'], true)) {
                    return $definition['type'];
                }
            }
        }

        return $default;
    }

    protected function formatData(array $rawData): array
    {
        return $rawData;
    }


    // Private Methods
    // =========================================================================

    private function _unwrapCacheEnvelope(mixed $cached): array
    {
        if (is_array($cached) && array_key_exists('raw', $cached) && array_key_exists('fetchedAt', $cached)) {
            return [$cached['raw'], (int)$cached['fetchedAt'], (float)($cached['generatedAt'] ?? $cached['fetchedAt'])];
        }

        // Legacy bare payload (pre-envelope) — treat as just-fetched for honesty.
        return [$cached, time(), 0.0];
    }
}
