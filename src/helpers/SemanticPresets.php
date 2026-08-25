<?php
namespace verbb\metrix\helpers;

use Craft;

/**
 * Question-oriented dashboard presets (canonical keys + inherit dashboard date range).
 */
class SemanticPresets
{
    // Static Methods
    // =========================================================================

    public static function getDefinitions(): array
    {
        return [
            'website-overview' => [
                'name' => Craft::t('metrix', 'Website Overview'),
                'description' => Craft::t('metrix', 'Traffic trend, live visitors, and key visitor metrics.'),
                'sortOrder' => 1,
                'widgets' => [
                    [
                        'type' => 'verbb\\metrix\\widgets\\Line',
                        'inheritPeriod' => true,
                        'canonicalMetric' => 'visitors',
                        'width' => '2',
                    ],
                    [
                        'type' => 'verbb\\metrix\\widgets\\Realtime',
                        'width' => '1',
                    ],
                    [
                        'type' => 'verbb\\metrix\\widgets\\Counter',
                        'inheritPeriod' => true,
                        'canonicalMetric' => 'visitors',
                        'width' => '1',
                    ],
                    [
                        'type' => 'verbb\\metrix\\widgets\\Counter',
                        'inheritPeriod' => true,
                        'canonicalMetric' => 'pageviews',
                        'width' => '1',
                    ],
                    [
                        'type' => 'verbb\\metrix\\widgets\\Pie',
                        'inheritPeriod' => true,
                        'canonicalMetric' => 'visitors',
                        'canonicalDimension' => 'device',
                        'width' => '1',
                    ],
                ],
            ],
            'content-performance' => [
                'name' => Craft::t('metrix', 'Content Performance'),
                'description' => Craft::t('metrix', 'Top pages and entry pages for the selected date range.'),
                'sortOrder' => 2,
                'widgets' => [
                    [
                        'type' => 'verbb\\metrix\\widgets\\Table',
                        'inheritPeriod' => true,
                        'canonicalMetric' => 'pageviews',
                        'canonicalDimension' => 'page',
                        'width' => '2',
                    ],
                    [
                        'type' => 'verbb\\metrix\\widgets\\Table',
                        'inheritPeriod' => true,
                        'canonicalMetric' => 'pageviews',
                        'canonicalDimension' => 'entry_page',
                        'width' => '1',
                    ],
                    [
                        'type' => 'verbb\\metrix\\widgets\\Line',
                        'inheritPeriod' => true,
                        'canonicalMetric' => 'pageviews',
                        'width' => '2',
                    ],
                ],
            ],
            'acquisition' => [
                'name' => Craft::t('metrix', 'Acquisition'),
                'description' => Craft::t('metrix', 'Where visitors come from — sources, referrers, and countries.'),
                'sortOrder' => 3,
                'widgets' => [
                    [
                        'type' => 'verbb\\metrix\\widgets\\Table',
                        'inheritPeriod' => true,
                        'canonicalMetric' => 'visitors',
                        'canonicalDimension' => 'source',
                        'width' => '1',
                    ],
                    [
                        'type' => 'verbb\\metrix\\widgets\\Table',
                        'inheritPeriod' => true,
                        'canonicalMetric' => 'visitors',
                        'canonicalDimension' => 'referrer',
                        'width' => '1',
                    ],
                    [
                        'type' => 'verbb\\metrix\\widgets\\Pie',
                        'inheritPeriod' => true,
                        'canonicalMetric' => 'visitors',
                        'canonicalDimension' => 'country',
                        'width' => '1',
                    ],
                    [
                        'type' => 'verbb\\metrix\\widgets\\Pie',
                        'inheritPeriod' => true,
                        'canonicalMetric' => 'visitors',
                        'canonicalDimension' => 'browser',
                        'width' => '1',
                    ],
                ],
            ],
            'realtime' => [
                'name' => Craft::t('metrix', 'Realtime'),
                'description' => Craft::t('metrix', 'Live visitor counts from connected realtime sources.'),
                'sortOrder' => 4,
                'widgets' => [
                    [
                        'type' => 'verbb\\metrix\\widgets\\Realtime',
                        'width' => '1',
                    ],
                    [
                        'type' => 'verbb\\metrix\\widgets\\Realtime',
                        'width' => '1',
                    ],
                ],
            ],
        ];
    }
}
