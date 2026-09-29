<?php

declare(strict_types=1);

use verbb\metrix\base\WidgetDataInterface;
use verbb\metrix\periods\Today;
use verbb\metrix\sources\Plausible;
use verbb\metrix\widgets\Counter;
use verbb\metrix\widgets\Table;

it('preserves fractional counter values and calculates comparisons without truncation', function() {
    $source = new class extends Plausible {
        public function fetchData(WidgetDataInterface $data): array
        {
            return ['total' => $data->period::getCurrentDateRange()['start']->format('Y-m-d') === date('Y-m-d') ? 25.5 : 12.75];
        }
    };
    $source->handle = 'fraction-' . bin2hex(random_bytes(8));
    $widget = new Counter(['period' => Today::class, 'metric' => 'bounce_rate']);
    $widget->setSource($source);

    expect($widget->getWidgetData()['rows'])->toBe([[25.5, 100.0]]);
});

it('preserves fractional dimension values while sorting and limiting rows', function() {
    $source = new class extends Plausible {
        public function fetchData(WidgetDataInterface $data): array
        {
            return ['low' => '0.33', 'high' => 12.75, 'middle' => '1.5'];
        }
    };
    $source->handle = 'fraction-' . bin2hex(random_bytes(8));
    $widget = new Table(['period' => Today::class, 'metric' => 'bounce_rate', 'dimension' => 'visit:source', 'limit' => 2]);
    $widget->setSource($source);

    expect($widget->getWidgetData()['rows'])->toBe([['high', 12.75], ['middle', 1.5]]);
});
