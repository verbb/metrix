<?php
namespace modules\metrixscreenshots;

use verbb\metrix\base\WidgetDataInterface;
use verbb\metrix\sources\Plausible;

use Craft;
use DateInterval;
use DateTime;

/** A deterministic source that exercises Metrix's real widget pipeline without external API calls. */
class ScreenshotPlausibleSource extends Plausible
{
    public function fetchAvailableMetrics(): array
    {
        return [
            ['label' => Craft::t('metrix', 'Sessions'), 'value' => 'sessions'],
            ['label' => Craft::t('metrix', 'Visitors'), 'value' => 'visitors'],
        ];
    }

    public function fetchAvailableDimensions(): array
    {
        return [
            ['label' => Craft::t('metrix', 'Country'), 'value' => 'country'],
            ['label' => Craft::t('metrix', 'Browser'), 'value' => 'browser'],
            ['label' => Craft::t('metrix', 'Operating system'), 'value' => 'operatingSystem'],
        ];
    }

    public function fetchData(WidgetDataInterface $widgetData): array
    {
        return match ($widgetData->dimension) {
            'country' => [
                'Australia' => 196,
                'United States' => 124,
                'United Kingdom' => 73,
                'Canada' => 42,
                'Germany' => 29,
            ],
            'browser' => [
                'Chrome' => 246,
                'Safari' => 121,
                'Firefox' => 48,
                'Edge' => 25,
                'Other' => 12,
            ],
            'operatingSystem' => [
                'macOS' => 187,
                'Windows' => 136,
                'iOS' => 71,
                'Android' => 42,
                'Linux' => 16,
            ],
            default => $this->timeSeries($widgetData),
        };
    }

    public function fetchRealtimeData(WidgetDataInterface $widgetData): array
    {
        return [Craft::t('metrix', 'Active users') => 8];
    }

    public function fetchConnection(): bool
    {
        return true;
    }

    private function timeSeries(WidgetDataInterface $widgetData): array
    {
        $range = $widgetData->period::getCurrentDateRange();
        $start = clone $range['start'];
        $end = clone $range['end'];
        $previousPeriod = $start < (new DateTime('now'))->sub(new DateInterval('P10D'));
        $values = $previousPeriod
            ? [54, 67, 61, 72, 70, 78, 64, 69]
            : [42, 57, 49, 73, 66, 71, 45, 49];
        $data = [];
        $index = 0;

        while ($start <= $end) {
            $data[$start->format('Y-m-d')] = $values[$index % count($values)];
            $start->modify('+1 day');
            $index++;
        }

        return $data;
    }
}
