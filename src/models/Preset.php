<?php
namespace verbb\metrix\models;

use verbb\metrix\Metrix;
use verbb\metrix\base\Widget;
use verbb\metrix\base\WidgetInterface;
use verbb\metrix\helpers\Options;

use craft\base\SavableComponent;
use craft\helpers\ArrayHelper;
use craft\helpers\Json;
use craft\helpers\UrlHelper;

use DateTime;

class Preset extends SavableComponent
{
    // Properties
    // =========================================================================

    public ?string $name = null;
    public ?string $handle = null;
    public bool $enabled = true;
    public ?int $sortOrder = null;
    public array $widgets = [];
    public ?DateTime $dateCreated = null;
    public ?DateTime $dateUpdated = null;
    public ?string $uid = null;


    // Public Methods
    // =========================================================================

    public function __construct(array $config)
    {
        if (isset($config['widgets'])) {
            if (is_string($config['widgets']) && Json::isJsonObject($config['widgets'])) {
                $config['widgets'] = Json::decode($config['widgets']);
            }

            if (is_array($config['widgets'])) {
                $config['widgets'] = $this->normalizeWidgets($config['widgets']);
            }
        }

        parent::__construct($config);
    }

    public function getCpEditUrl(): string
    {
        return UrlHelper::cpUrl('metrix/settings/presets/edit/' . $this->id);
    }

    public function normalizeWidgets(array $widgetConfigs): array
    {
        $widgets = [];

        foreach ($widgetConfigs as $widgetConfig) {
            if ($widgetConfig instanceof WidgetInterface) {
                $widgets[] = $widgetConfig;

                continue;
            }

            // Strip off any invalid content from the front-end
            ArrayHelper::remove($widgetConfig, 'id');
            ArrayHelper::remove($widgetConfig, 'metricLabel');
            ArrayHelper::remove($widgetConfig, 'dimensionLabel');
            ArrayHelper::remove($widgetConfig, 'periodLabel');

            // Null source is okay here, as that might not be setup yet
            if (array_key_exists('source', $widgetConfig) && $widgetConfig['source'] === null) {
                ArrayHelper::remove($widgetConfig, 'source');
            }

            // Presets aren't associated with a view
            ArrayHelper::remove($widgetConfig, 'view');

            $widgets[] = Metrix::$plugin->getWidgets()->createWidget($widgetConfig);
        }

        return $widgets;
    }

    public function setWidgets(array $widgetConfigs): void
    {
        $this->widgets = $this->normalizeWidgets($widgetConfigs);
    }

    public function getWidgets(): array
    {
        return $this->widgets;
    }

    public function getFrontEndWidgets(): array
    {
        $widgets = [];

        // Presets often have no source set, because they can be saved at the project config level before
        // any sources exist. But when converting to widgets, they must have a source.
        $firstSource = Metrix::$plugin->getSources()->getAllConfiguredSources()[0] ?? null;

        foreach ($this->getWidgets() as $widget) {
            // Set a default source, if not already set
            if ($firstSource && !$widget->getSource()) {
                $widget->setSource($firstSource);
            }

            $widgets[] = $widget->getFrontEndData();
        }

        return $widgets;
    }

    public function getSerializedWidgets(): array
    {
        $widgets = [];

        foreach ($this->getWidgets() as $widget) {
            $widgetConfig = $widget->getSerializedWidget();
            $widgetConfig['type'] = get_class($widget);

            // Strip off any invalid content from the front-end
            ArrayHelper::remove($widgetConfig, 'id');
            ArrayHelper::remove($widgetConfig, 'metricLabel');
            ArrayHelper::remove($widgetConfig, 'dimensionLabel');
            ArrayHelper::remove($widgetConfig, 'periodLabel');
            ArrayHelper::remove($widgetConfig, 'view');

            $widgets[] = $widgetConfig;
        }

        return $widgets;
    }

    public function getComponentSettings(): array
    {
        $widgets = $this->getFrontEndWidgets();
        $widgetTypeOptions = Options::getEnabledWidgetTypeSchemaOptions();
        $newWidget = Widget::getNewWigetConfig();

        return [
            'widgets' => $widgets,
            'widgetSettings' => $widgetTypeOptions,
            'newWidget' => $newWidget,
        ];
    }
}
