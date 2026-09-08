<?php
/**
 * Docs-only analytics source for screenshot installs. Returns deterministic mock
 * series so charts render without OAuth or live provider APIs.
 *
 * Seeded dashboard mirrors the classic Metrix docs cutout (Sessions line +
 * realtime/counter + browser/OS/country breakdowns).
 *
 * Loaded via modules/metrixdocs (injected by plugin.bootstrap.ts).
 */

namespace modules\metrixdocs;

use verbb\metrix\base\CredentialsSource;
use verbb\metrix\base\WidgetDataInterface;

use Craft;

use DateInterval;
use DatePeriod;
use DateTime;

use GuzzleHttp\Client;

class DocsDemoSource extends CredentialsSource
{
    public static string $providerHandle = 'docsDemo';

    public static function displayName(): string
    {
        return 'Demo Analytics';
    }

    public function getPrimaryColor(): ?string
    {
        return '#3B82F6';
    }

    public function getIcon(): ?string
    {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 17V9"/><path d="M12 17V7"/><path d="M16 17v-5"/></svg>';
    }

    public function getSettingsHtml(): ?string
    {
        return '';
    }

    public function getClient(): Client
    {
        return Craft::createGuzzleClient();
    }

    public function fetchConnection(): bool
    {
        return true;
    }

    public function fetchAvailableMetrics(): array
    {
        return [
            ['label' => 'Sessions', 'value' => 'sessions'],
            ['label' => 'Visitors', 'value' => 'visitors'],
            ['label' => 'Pageviews', 'value' => 'pageviews'],
        ];
    }

    public function fetchAvailableDimensions(): array
    {
        return [
            ['label' => 'Browser', 'value' => 'browser'],
            ['label' => 'Operating system', 'value' => 'os'],
            ['label' => 'Country', 'value' => 'country'],
            ['label' => 'Device', 'value' => 'device'],
            ['label' => 'Page', 'value' => 'page'],
        ];
    }

    public function fetchData(WidgetDataInterface $widgetData): array
    {
        $widget = $widgetData->widget;

        if ($widget::supportsDimensions() && $widgetData->dimension) {
            return match ($widgetData->dimension) {
                // Screen-2 pie: Chrome dominant, then Safari / Firefox / Edge / Opera / Other.
                'browser' => [
                    'Chrome' => 210,
                    'Safari' => 95,
                    'Firefox' => 48,
                    'Edge' => 36,
                    'Opera' => 22,
                    'Other' => 18,
                ],
                // Screen-2 OS table.
                'os' => [
                    'Macintosh' => 260,
                    'Windows' => 91,
                    'iOS' => 41,
                    'Android' => 39,
                    'Linux' => 14,
                    'Chrome OS' => 2,
                ],
                // More than one page of rows so the table shows pagination controls.
                'country' => [
                    'United States' => 125,
                    'Belgium' => 52,
                    'Netherlands' => 39,
                    'United Kingdom' => 31,
                    'India' => 29,
                    'Canada' => 19,
                    'Germany' => 17,
                    'France' => 14,
                    'Australia' => 12,
                    'Spain' => 9,
                ],
                'device' => [
                    'Desktop' => 1240,
                    'Mobile' => 890,
                    'Tablet' => 210,
                ],
                'page' => [
                    '/' => 520,
                    '/pricing' => 310,
                    '/blog' => 180,
                    '/docs' => 140,
                    '/contact' => 95,
                ],
                default => [
                    'Other' => 100,
                ],
            };
        }

        return $this->buildPlotSeries($widgetData);
    }

    public function fetchRealtimeData(WidgetDataInterface $widgetData): array
    {
        // Match the docs cutout’s single active user.
        return [Craft::t('metrix', 'Active users') => 1];
    }

    protected function getCanonicalMetricMap(): array
    {
        return [
            'sessions' => 'sessions',
            'visitors' => 'visitors',
            'pageviews' => 'pageviews',
        ];
    }

    protected function getCanonicalDimensionMap(): array
    {
        return [
            'browser' => 'browser',
            'os' => 'os',
            'country' => 'country',
            'device' => 'device',
            'page' => 'page',
        ];
    }

    /**
     * Deterministic daily buckets for the active period (and previous-period fetches).
     *
     * Current Last 7 Days totals ~452 sessions; previous period is higher so the
     * counter reads about −67% (screen-2 cutout).
     *
     * @return array<string, int>
     */
    private function buildPlotSeries(WidgetDataInterface $widgetData): array
    {
        $range = $widgetData->period::getCurrentDateRange();
        $start = (clone $range['start'])->setTime(0, 0, 0);
        $end = (clone $range['end'])->setTime(0, 0, 0)->modify('+1 day');
        $period = new DatePeriod($start, new DateInterval('P1D'), $end);

        $days = [];
        foreach ($period as $day) {
            if ($day instanceof DateTime) {
                $days[] = $day;
            }
        }

        if (!$days) {
            return [];
        }

        // Shape sized for Last7Days’ ~8 daily buckets (−7 days → today).
        // Current sum ≈ 452; previous ≈ 1367 → about −67% on the counter (screen-2).
        $currentShape = [95, 48, 28, 42, 62, 58, 59, 60];
        $previousShape = [170, 185, 200, 178, 195, 182, 187, 170];

        // Last7Days current starts at −7 days (daysBack ≈ 7); previous at −14.
        // Prefer comparing against getPreviousDateRange() which is independent of
        // CounterData’s temporary $currentDateRange swap.
        $prevStart = (clone $widgetData->period::getPreviousDateRange()['start'])->setTime(0, 0, 0);
        $usePrevious = $start->format('Y-m-d') === $prevStart->format('Y-m-d');

        $shape = $usePrevious ? $previousShape : $currentShape;
        $metricBoost = match ($widgetData->metric) {
            'pageviews' => 12,
            'visitors' => 4,
            default => 0,
        };

        $data = [];
        foreach ($days as $i => $day) {
            $base = $shape[$i % count($shape)];
            $data[$day->format('Y-m-d')] = $base + $metricBoost;
        }

        return $data;
    }
}
