<?php

declare(strict_types=1);

use verbb\metrix\Metrix;
use verbb\metrix\base\WidgetData;
use verbb\metrix\base\WidgetDataInterface;
use verbb\metrix\widgets\Counter;

use yii\mutex\Mutex;

beforeEach(function() {
    $this->originalCacheEnabled = Metrix::$plugin->getSettings()->enableCache;
    $this->originalCacheDuration = Metrix::$plugin->getSettings()->cacheDuration;
    $this->originalMutex = Craft::$app->get('mutex');
    Metrix::$plugin->getSettings()->enableCache = true;
    Metrix::$plugin->getSettings()->cacheDuration = 'PT10M';
});

afterEach(function() {
    Craft::$app->set('mutex', $this->originalMutex);
    Metrix::$plugin->getSettings()->enableCache = $this->originalCacheEnabled;
    Metrix::$plugin->getSettings()->cacheDuration = $this->originalCacheDuration;
});

function securityWidgetData(): WidgetData
{
    $widget = new class extends Counter {
        public int $fetchCount = 0;

        public function fetchData(WidgetDataInterface $widgetData): array
        {
            $this->fetchCount++;

            return ['total' => $this->fetchCount];
        }
    };

    return new WidgetData(['widget' => $widget]);
}

it('returns cached data instead of fetching unlocked after mutex timeout', function() {
    $data = securityWidgetData();
    $first = $data->getData();

    Craft::$app->set('mutex', new class extends Mutex {
        protected function acquireLock($name, $timeout = 0): bool
        {
            return false;
        }

        protected function releaseLock($name): bool
        {
            return true;
        }
    });

    $refresh = $data->getData(true);

    expect($first['total'])->toBe(1)
        ->and($refresh['total'])->toBe(1)
        ->and($refresh['_meta']['fromCache'])->toBeTrue()
        ->and($data->widget->fetchCount)->toBe(1);
});

it('uses a leader generation produced while a refresh follower waits', function() {
    $data = securityWidgetData();
    $cacheKey = $data->getCacheKey();
    $cache = Craft::$app->getCache();

    Craft::$app->set('mutex', new class($cache, $cacheKey) extends Mutex {
        public function __construct(private mixed $cache, private string $cacheKey, $config = [])
        {
            parent::__construct($config);
        }

        protected function acquireLock($name, $timeout = 0): bool
        {
            $this->cache->set($this->cacheKey, [
                'raw' => ['total' => 9],
                'fetchedAt' => time(),
                'generatedAt' => microtime(true) + 1,
            ], 600);

            return true;
        }

        protected function releaseLock($name): bool
        {
            return true;
        }
    });

    $refresh = $data->getData(true);

    expect($refresh['total'])->toBe(9)
        ->and($refresh['_meta']['fromCache'])->toBeTrue()
        ->and($data->widget->fetchCount)->toBe(0);
});

it('coalesces a leader generation when persistent caching is disabled', function() {
    Metrix::$plugin->getSettings()->enableCache = false;
    $data = securityWidgetData();
    $cacheKey = $data->getCacheKey();
    $cache = Craft::$app->getCache();

    Craft::$app->set('mutex', new class($cache, $cacheKey) extends Mutex {
        public function __construct(private mixed $cache, private string $cacheKey, $config = [])
        {
            parent::__construct($config);
        }

        protected function acquireLock($name, $timeout = 0): bool
        {
            $this->cache->set($this->cacheKey, [
                'raw' => ['total' => 11],
                'fetchedAt' => time(),
                'generatedAt' => microtime(true) + 1,
            ], 1);

            return true;
        }

        protected function releaseLock($name): bool
        {
            return true;
        }
    });

    $result = $data->getData(true);

    expect($result['total'])->toBe(11)
        ->and($result['_meta']['fromCache'])->toBeTrue()
        ->and($data->widget->fetchCount)->toBe(0);
});

it('coalesces a leader generation for realtime widgets', function() {
    $widget = new class extends Counter {
        public int $fetchCount = 0;

        public static function supportsCache(): bool
        {
            return false;
        }

        public function fetchData(WidgetDataInterface $widgetData): array
        {
            $this->fetchCount++;

            return ['total' => $this->fetchCount];
        }
    };
    $data = new WidgetData(['widget' => $widget]);
    $cacheKey = $data->getCacheKey();
    $cache = Craft::$app->getCache();

    Craft::$app->set('mutex', new class($cache, $cacheKey) extends Mutex {
        public function __construct(private mixed $cache, private string $cacheKey, $config = [])
        {
            parent::__construct($config);
        }

        protected function acquireLock($name, $timeout = 0): bool
        {
            $this->cache->set($this->cacheKey, [
                'raw' => ['total' => 12],
                'fetchedAt' => time(),
                'generatedAt' => microtime(true) + 1,
            ], 1);

            return true;
        }

        protected function releaseLock($name): bool
        {
            return true;
        }
    });

    $result = $data->getData();

    expect($result['total'])->toBe(12)
        ->and($result['_meta']['fromCache'])->toBeTrue()
        ->and($widget->fetchCount)->toBe(0);
});
