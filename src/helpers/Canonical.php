<?php
namespace verbb\metrix\helpers;

use verbb\metrix\base\Source;

use Craft;

/**
 * Curated metric/dimension vocabulary for presets, semantic widgets, and grouped picker UI.
 *
 * Providers map canonical keys to native API values; unsupported keys are omitted per source.
 * Full provider-native catalog remains available alongside the Common group.
 */
class Canonical
{
    public const PREFIX = '__canonical__:';


    // Static Methods
    // =========================================================================

    public static function getMetrics(): array
    {
        return [
            'visitors' => [
                'label' => 'Unique visitors',
                'type' => 'integer',
            ],
            'pageviews' => [
                'label' => 'Page views',
                'type' => 'integer',
            ],
            'sessions' => [
                'label' => 'Sessions',
                'type' => 'integer',
            ],
            'bounce_rate' => [
                'label' => 'Bounce rate',
                'type' => 'percentage',
            ],
            'avg_duration' => [
                'label' => 'Average visit duration',
                'type' => 'duration',
            ],
            'events' => [
                'label' => 'Events',
                'type' => 'integer',
            ],
        ];
    }

    public static function getDimensions(): array
    {
        return [
            'page' => [
                'label' => 'Page',
            ],
            'entry_page' => [
                'label' => 'Entry page',
            ],
            'source' => [
                'label' => 'Traffic source',
            ],
            'referrer' => [
                'label' => 'Referrer',
            ],
            'country' => [
                'label' => 'Country',
            ],
            'region' => [
                'label' => 'Region',
            ],
            'device' => [
                'label' => 'Device type',
            ],
            'browser' => [
                'label' => 'Browser',
            ],
            'os' => [
                'label' => 'Operating system',
            ],
        ];
    }

    public static function isCanonicalValue(?string $value): bool
    {
        return $value !== null && str_starts_with($value, self::PREFIX);
    }

    public static function canonicalKeyFromValue(?string $value): ?string
    {
        if (!self::isCanonicalValue($value)) {
            return null;
        }

        return substr($value, strlen(self::PREFIX));
    }

    public static function valueFromCanonicalKey(string $key): string
    {
        return self::PREFIX . $key;
    }

    public static function getMetricLabel(string $key): ?string
    {
        $definition = self::getMetrics()[$key] ?? null;

        if (!$definition) {
            return null;
        }

        return Craft::t('metrix', $definition['label']);
    }

    public static function getDimensionLabel(string $key): ?string
    {
        $definition = self::getDimensions()[$key] ?? null;

        if (!$definition) {
            return null;
        }

        return Craft::t('metrix', $definition['label']);
    }

    /**
     * Common options first, then the provider's full native list in a labelled group.
     */
    public static function mergeGroupedPropertyOptions(Source $source, array $nativeOptions, string $property): array
    {
        $definitions = $property === 'metrics' ? self::getMetrics() : self::getDimensions();
        $options = [];

        foreach ($definitions as $key => $definition) {
            $resolved = $property === 'metrics'
                ? $source->resolveCanonicalMetric($key)
                : $source->resolveCanonicalDimension($key);

            if ($resolved === null) {
                continue;
            }

            $options[] = [
                'label' => Craft::t('metrix', $definition['label']),
                'value' => self::valueFromCanonicalKey($key),
                'group' => Craft::t('metrix', 'Common'),
            ];
        }

        foreach ($nativeOptions as $option) {
            $options[] = array_merge($option, [
                'group' => $source->getProviderName(),
            ]);
        }

        return $options;
    }
}
