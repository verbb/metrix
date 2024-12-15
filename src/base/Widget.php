<?php
namespace verbb\metrix\base;

use verbb\metrix\Metrix;
use verbb\metrix\base\SourceInterface;
use verbb\metrix\helpers\Options;
use verbb\metrix\models\View;
use verbb\metrix\widgets as widgetTypes;

use Craft;
use craft\base\SavableComponent;

abstract class Widget extends SavableComponent implements WidgetInterface
{
    // Static Methods
    // =========================================================================

    public static function supportsDimensions(): bool
    {
        return false;
    }

    public static function getNewWigetConfig(): array
    {
        return Metrix::$plugin->getSettings()->getNewWidgetConfig();
    }


    // Properties
    // =========================================================================

    public ?int $sourceId = null;
    public ?int $viewId = null;
    public ?int $sortOrder = null;
    public ?string $uid = null;

    public ?string $period = null;
    public ?string $metric = null;
    public ?string $dimension = null;
    public ?int $width = null;

    private ?SourceInterface $_source = null;
    private ?View $_view = null;


    // Public Methods
    // =========================================================================

    public function defineRules(): array
    {
        $rules = parent::defineRules();

        $rules[] = [['period', 'metric', 'dimension', 'width'], 'safe'];

        return $rules;
    }

    public function settingsAttributes(): array
    {
        $attributes = parent::settingsAttributes();
        $attributes[] = 'period';
        $attributes[] = 'metric';
        $attributes[] = 'dimension';
        $attributes[] = 'width';

        return $attributes;
    }

    public function getSource(): ?SourceInterface
    {
        if (!$this->_source && $this->sourceId) {
            $this->_source = Metrix::$plugin->getSources()->getSourceById($this->sourceId);
        }

        return $this->_source;
    }

    public function setSource(SourceInterface|string $source): void
    {
        if (is_string($source)) {
            $source = Metrix::$plugin->getSources()->getSourceByHandle($source);
        }

        $this->_source = $source;
        $this->sourceId = $source->id;
    }

    public function getView(): ?View
    {
        if (!$this->_view && $this->viewId) {
            $this->_view = Metrix::$plugin->getViews()->getViewById($this->viewId);
        }

        return $this->_view;
    }

    public function setView(View $view): void
    {
        $this->_view = $view;
        $this->viewId = $view->id;
    }

    public function getFrontEndData(): array
    {
        // Get labels for the front-end
        if ($source = $this->getSource()) {
            $metricLabel = $this->_getValueForLabel($source->getAvailableMetrics(), $this->metric);
            $dimensionLabel = $this->_getValueForLabel($source->getAvailableDimensions(), $this->dimension);
        }

        return [
            'id' => $this->id,
            'source' => $this->getSource()?->handle,
            'view' => $this->getView()?->handle,
            'type' => get_class($this),
            'period' => $this->period,
            'periodLabel' => $this->_getValueForLabel(Options::getPeriodOptions(), $this->period),
            'metric' => $this->metric,
            'metricLabel' => $metricLabel ?? null,
            'dimension' => $this->dimension,
            'dimensionLabel' => $dimensionLabel ?? null,
            'width' => (string)$this->width,
        ];
    }

    public function getSerializedWidget(): array
    {
        return $this->getSettings();
    }

    public function getWidgetData(): array
    {
        $dataTypeClass = $this->getDataType();
        $source = $this->getSource();

        if ($source) {
            $dataType = new $dataTypeClass([
                'widget' => $this,
                'source' => $source,
                'period' => $this->period,
                'metric' => $this->metric,
                'dimension' => $this->dimension,
            ]);

            return $dataType->getData();
        }

        return [];
    }


    // Private Methods
    // =========================================================================

    private function _getValueForLabel(array $options, ?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        foreach ($options as $option) {
            if ($option['value'] === $value) {
                return $option['label'];
            }
        }

        return null;
    }
}