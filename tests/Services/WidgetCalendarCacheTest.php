<?php

declare(strict_types=1);

use verbb\metrix\Metrix;
use verbb\metrix\base\WidgetData;
use verbb\metrix\base\WidgetDataInterface;
use verbb\metrix\periods\Today;
use verbb\metrix\sources\Plausible;
use verbb\metrix\widgets\Counter;

it('does not reuse a previous calendar day for Today after midnight', function() {
    $settings = Metrix::$plugin->getSettings();
    $enabled = $settings->enableCache;
    $duration = $settings->cacheDuration;
    $settings->enableCache = true;
    $settings->cacheDuration = 'PT10M';
    $source = new class extends Plausible {
        public function fetchData(WidgetDataInterface $data): array
        {
            return ['date' => $data->period::getCurrentDateRange()['start']->format('Y-m-d')];
        }
    };
    $source->handle = 'calendar' . bin2hex(random_bytes(5));
    $widget = new Counter();
    $widget->setSource($source);
    $data = new WidgetData(['source' => $source, 'widget' => $widget, 'period' => Today::class]);

    try {
        foreach (['2026-09-15', '2026-09-16'] as $day) {
            $range = ['start' => new DateTime($day), 'end' => new DateTime($day . ' 23:59:59')];
            $result = Today::withDateRange($range, fn() => $data->getData());
            expect($result['date'])->toBe($day);
        }
    } finally {
        $settings->enableCache = $enabled;
        $settings->cacheDuration = $duration;
    }
});

it('reuses the same calendar cache while the current time advances', function() {
    $data = new WidgetData(['widget' => new Counter(), 'period' => Today::class]);
    $keys = [];
    foreach (['12:00:01', '12:00:02'] as $time) {
        $range = ['start' => new DateTime('2026-09-16'), 'end' => new DateTime('2026-09-16 ' . $time)];
        $keys[] = Today::withDateRange($range, fn() => $data->getCacheKey());
    }

    expect($keys[0])->toBe($keys[1]);
});
