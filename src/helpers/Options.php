<?php
namespace verbb\metrix\helpers;

use verbb\metrix\Metrix;

use Craft;

class Options
{
    // Static Methods
    // =========================================================================

    public static function getSourceOptions(): array
    {
        $options = [];

        foreach (Metrix::$plugin->getSources()->getAllConfiguredSources() as $source) {
            $options[] = ['label' => $source->name, 'value' => $source->handle];
        }

        return $options;
    }

    public static function getPresetOptions(): array
    {
        $options = [];

        foreach (Metrix::$plugin->getPresets()->getAllEnabledPresets() as $preset) {
            $options[] = ['label' => $preset->name, 'value' => $preset->handle];
        }

        return $options;
    }

    public static function getWidgetTypeOptions(): array
    {
        $options = [];

        foreach (Metrix::$plugin->getWidgets()->getAllWidgetTypes() as $widgetType) {
            $options[] = ['label' => $widgetType::displayName(), 'value' => $widgetType];
        }

        return $options;
    }

    public static function getEnabledWidgetTypeOptions(): array
    {
        $options = [];

        foreach (Metrix::$plugin->getSettings()->getEnabledWidgetTypes() as $widgetType) {
            $options[] = ['label' => $widgetType::displayName(), 'value' => $widgetType];
        }

        return $options;
    }

    public static function getEnabledWidgetTypeSchemaOptions(): array
    {
        $options = [];

        foreach (Metrix::$plugin->getSettings()->getEnabledWidgetTypes() as $widgetType) {
            $options[] = [
                'type' => $widgetType,
                'schema' => array_values(array_filter($widgetType::getSettingsSchema())),
            ];
        }

        return $options;
    }

    public static function getWidthOptions(): array
    {
        return [
            ['label' => Craft::t('metrix', '1 Column'), 'value' => '1'],
            ['label' => Craft::t('metrix', '2 Columns'), 'value' => '2'],
            ['label' => Craft::t('metrix', '3 Columns'), 'value' => '3'],
        ];
    }

    public static function getPeriodOptions(): array
    {
        return array_merge(...static::getGroupedPeriodOptions());
    }

    public static function getEnabledPeriodOptions(): array
    {
        return array_merge(...static::getEnabledGroupedPeriodOptions());
    }

    public static function getGroupedPeriodOptions(): array
    {
        $options = [];

        foreach (Metrix::$plugin->getPeriods()->getGroupedPeriodTypes() as $groupKey => $group) {
            foreach ($group as $period) {
                $options[$groupKey][] = ['label' => $period::displayName(), 'value' => $period];
            }
        }

        return $options;
    }

    public static function getEnabledGroupedPeriodOptions(): array
    {
        $options = [];

        foreach (Metrix::$plugin->getSettings()->getEnabledPeriods() as $groupKey => $group) {
            foreach ($group as $period) {
                $options[$groupKey][] = ['label' => $period::displayName(), 'value' => $period];
            }
        }

        return $options;
    }

    public static function getViewOptions(): array
    {
        $options = [];

        foreach (Metrix::$plugin->getViews()->getAllViewableViews() as $view) {
            $options[] = ['label' => $view->name, 'value' => $view->handle];
        }

        return $options;
    }

}
