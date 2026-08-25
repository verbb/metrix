<?php
namespace verbb\metrix\helpers;

use verbb\metrix\Metrix;
use verbb\metrix\helpers\Options;

use Craft;

class Schema
{
    // Static Methods
    // =========================================================================

    public static function sources(array $config = []): array
    {
        $sourceOptions = Options::getSourceOptions();

        if (count($sourceOptions) === 0) {
            return [];
        }

        if (count($sourceOptions) === 1) {
            return array_merge([
                'type' => 'hidden',
                'name' => 'source',
                'value' => $sourceOptions[0]['value'],
            ], $config);
        }

        return array_merge([
            'type' => 'select',
            'label' => Craft::t('metrix', 'Source'),
            'instructions' => Craft::t('metrix', 'Select the data source for the widget.'),
            'name' => 'source',
            'placeholder' => Craft::t('metrix', 'Select an option'),
            'validation' => ['required' => true],
            'options' => $sourceOptions,
        ], $config);
    }

    public static function chartTypes(array $config = []): array
    {
        return array_merge([
            'type' => 'select',
            'label' => Craft::t('metrix', 'Chart Type'),
            'instructions' => Craft::t('metrix', 'Choose the type of chart to display.'),
            'name' => 'type',
            'placeholder' => Craft::t('metrix', 'Select an option'),
            'validation' => ['required' => true],
            'options' => Options::getEnabledWidgetTypeOptions(),
            // Client filters Realtime when the selected source lacks supportsRealtime().
            'capabilityFilter' => true,
        ], $config);
    }

    public static function titles(array $config = []): array
    {
        return array_merge([
            'type' => 'text',
            'label' => Craft::t('metrix', 'Title'),
            'instructions' => Craft::t('metrix', 'Optional custom title. Leave blank to use the metric/dimension labels.'),
            'name' => 'title',
            'placeholder' => Craft::t('metrix', 'Auto'),
        ], $config);
    }

    public static function subtitles(array $config = []): array
    {
        return array_merge([
            'type' => 'text',
            'label' => Craft::t('metrix', 'Subtitle'),
            'instructions' => Craft::t('metrix', 'Optional supporting text shown under the title.'),
            'name' => 'subtitle',
        ], $config);
    }

    public static function limits(array $config = []): array
    {
        return array_merge([
            'type' => 'select',
            'label' => Craft::t('metrix', 'Row limit'),
            'instructions' => Craft::t('metrix', 'Maximum rows to fetch and display for this widget.'),
            'name' => 'limit',
            'options' => [
                ['label' => '5', 'value' => '5'],
                ['label' => '10', 'value' => '10'],
                ['label' => '25', 'value' => '25'],
                ['label' => '50', 'value' => '50'],
                ['label' => '100', 'value' => '100'],
            ],
        ], $config);
    }

    public static function periods(array $config = []): array
    {
        return array_merge([
            'type' => 'select',
            'label' => Craft::t('metrix', 'Period'),
            'instructions' => Craft::t('metrix', 'Select the time period for the widget data.'),
            'name' => 'period',
            'placeholder' => Craft::t('metrix', 'Select an option'),
            'validation' => ['required' => true],
            'options' => Options::getEnabledPeriodOptions(),
        ], $config);
    }

    public static function metrics(array $config = []): array
    {
        return array_merge([
            'type' => 'combobox',
            'label' => Craft::t('metrix', 'Metric'),
            'instructions' => Craft::t('metrix', 'Choose the metric to display in the widget.'),
            'name' => 'metric',
            'placeholder' => Craft::t('metrix', 'Select an option'),
            'validation' => ['required' => true],
        ], $config);
    }

    public static function dimensions(array $config = []): array
    {
        return array_merge([
            'type' => 'combobox',
            'label' => Craft::t('metrix', 'Dimension'),
            'instructions' => Craft::t('metrix', 'Choose a dimension for the data, such as device or browser.'),
            'name' => 'dimension',
            'placeholder' => Craft::t('metrix', 'Select an option'),
            'validation' => ['required' => true],
        ], $config);
    }

    public static function widths(array $config = []): array
    {
        return array_merge([
            'type' => 'select',
            'label' => Craft::t('metrix', 'Width'),
            'instructions' => Craft::t('metrix', 'Select the column size for the widget.'),
            'name' => 'width',
            'placeholder' => Craft::t('metrix', 'Select an option'),
            'validation' => ['required' => true],
            'options' => Options::getWidthOptions(),
        ], $config);
    }
}
