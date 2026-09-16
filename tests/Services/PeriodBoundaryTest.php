<?php

declare(strict_types=1);

use verbb\metrix\base\WidgetData;
use verbb\metrix\periods\Last7Days;
use verbb\metrix\periods\Last30Days;
use verbb\metrix\periods\Last12Months;
use verbb\metrix\periods\LastWeek;
use verbb\metrix\periods\Today;
use verbb\metrix\periods\Yesterday;

it('uses the labelled number of dates without overlapping comparison days', function(string $period, int $days) {
    $current = $period::getDateRange();
    $previous = $period::getPreviousDateRange();
    expect((int)$current['start']->diff($current['end'])->format('%a') + 1)->toBe($days)
        ->and((int)$previous['start']->diff($previous['end'])->format('%a') + 1)->toBe($days)
        ->and($previous['end']->format('Y-m-d'))->toBe((clone $current['start'])->modify('-1 day')->format('Y-m-d'));
})->with([[Last7Days::class, 7], [Last30Days::class, 30]]);

it('queries last week from Monday through Sunday inclusively', function() {
    $current = LastWeek::getDateRange();
    $previous = LastWeek::getPreviousDateRange();
    expect($current['start']->format('Y-m-d H:i:s'))->toBe((new DateTime('monday last week'))->format('Y-m-d') . ' 00:00:00')
        ->and($current['end']->format('Y-m-d H:i:s'))->toBe((new DateTime('sunday last week'))->format('Y-m-d') . ' 23:59:59')
        ->and($previous['end']->getTimestamp())->toBe($current['start']->getTimestamp() - 1)
        ->and(LastWeek::generatePlotDimensions(new WidgetData(), []))->toHaveCount(7);
});

it('uses first-of-month keys for twelve monthly buckets', function() {
    $buckets = Last12Months::generatePlotDimensions(new WidgetData(), []);
    expect($buckets)->toHaveCount(12);
    foreach ($buckets as $bucket) {
        expect(substr($bucket, -2))->toBe('01');
    }
    $current = Last12Months::getDateRange();
    $previous = Last12Months::getPreviousDateRange();
    expect($previous['end']->getTimestamp())->toBe($current['start']->getTimestamp() - 1);
});

it('does not append next-day midnight to hourly day charts', function(string $period) {
    $range = ['start' => new DateTime('2026-09-10 00:00:00'), 'end' => new DateTime('2026-09-10 23:59:59')];
    $buckets = $period::withDateRange($range, fn() => $period::generatePlotDimensions(new WidgetData(), []));
    expect($buckets)->toHaveCount(24)->and(end($buckets))->toBe('2026-09-10 23:00:00');
})->with([Today::class, Yesterday::class]);

it('clamps month-to-date comparisons to the previous month at month end', function() {
    $period = new class extends \verbb\metrix\periods\MonthToDate {
        public static function getDateRange(): array
        {
            return ['start' => new DateTime('2026-03-01'), 'end' => new DateTime('2026-03-31 12:34:56')];
        }
    };
    $range = $period::getPreviousDateRange();
    expect($range['start']->format('Y-m-d'))->toBe('2026-02-01')
        ->and($range['end']->format('Y-m-d H:i:s'))->toBe('2026-02-28 12:34:56');
});

it('clamps year-to-date comparisons to February on leap day', function() {
    $period = new class extends \verbb\metrix\periods\YearToDate {
        public static function getDateRange(): array
        {
            return ['start' => new DateTime('2024-01-01'), 'end' => new DateTime('2024-02-29 12:34:56')];
        }
    };
    $range = $period::getPreviousDateRange();
    expect($range['start']->format('Y-m-d'))->toBe('2023-01-01')
        ->and($range['end']->format('Y-m-d H:i:s'))->toBe('2023-02-28 12:34:56');
});
