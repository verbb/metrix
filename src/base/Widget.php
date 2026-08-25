<?php
namespace verbb\metrix\base;

use verbb\metrix\Metrix;
use verbb\metrix\base\SourceInterface;
use verbb\metrix\helpers\Canonical;
use verbb\metrix\helpers\Options;
use verbb\metrix\models\View;

use verbb\metrix\widgets\data\RealtimeData;

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

    public static function supportsCache(): bool
    {
        return true;
    }

    public static function getNewWidgetConfig(): array
    {
        return Metrix::$plugin->getSettings()->getNewWidgetConfig();
    }

    /** @deprecated Use {@see getNewWidgetConfig()}. */
    public static function getNewWigetConfig(): array
    {
        return static::getNewWidgetConfig();
    }

    public static function getAssetBundle(): ?string
    {
        return null;
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
    public ?string $canonicalMetric = null;
    public ?string $canonicalDimension = null;
    public ?bool $inheritPeriod = null;
    public ?int $width = null;

    private ?SourceInterface $_source = null;
    private ?View $_view = null;


    // Public Methods
    // =========================================================================

    public function defineRules(): array
    {
        $rules = parent::defineRules();

        $rules[] = [['period', 'metric', 'dimension', 'canonicalMetric', 'canonicalDimension', 'inheritPeriod', 'width'], 'safe'];

        return $rules;
    }

    public function settingsAttributes(): array
    {
        $attributes = parent::settingsAttributes();
        $attributes[] = 'period';
        $attributes[] = 'metric';
        $attributes[] = 'dimension';
        $attributes[] = 'canonicalMetric';
        $attributes[] = 'canonicalDimension';
        $attributes[] = 'inheritPeriod';
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

    /**
     * Normalizes picker values into native and/or canonical storage fields.
     */
    public function normalizePropertyFields(?string $metric, ?string $dimension): void
    {
        if ($metric !== null) {
            if ($canonicalKey = Canonical::canonicalKeyFromValue($metric)) {
                $this->canonicalMetric = $canonicalKey;
                $this->metric = null;
            } else {
                $this->metric = $metric;
                $this->canonicalMetric = null;
            }
        }

        if ($dimension !== null) {
            if ($canonicalKey = Canonical::canonicalKeyFromValue($dimension)) {
                $this->canonicalDimension = $canonicalKey;
                $this->dimension = null;
            } else {
                $this->dimension = $dimension;
                $this->canonicalDimension = null;
            }
        }
    }

    public function getResolvedMetric(): ?string
    {
        // Picker may still pass `__canonical__:visitors` as the metric value before normalize.
        if ($this->metric) {
            if ($canonicalKey = Canonical::canonicalKeyFromValue($this->metric)) {
                return $this->getSource()?->resolveCanonicalMetric($canonicalKey);
            }

            return $this->metric;
        }

        if ($this->canonicalMetric && ($source = $this->getSource())) {
            return $source->resolveCanonicalMetric($this->canonicalMetric);
        }

        return null;
    }

    public function getResolvedDimension(): ?string
    {
        if ($this->dimension) {
            if ($canonicalKey = Canonical::canonicalKeyFromValue($this->dimension)) {
                return $this->getSource()?->resolveCanonicalDimension($canonicalKey);
            }

            return $this->dimension;
        }

        if ($this->canonicalDimension && ($source = $this->getSource())) {
            return $source->resolveCanonicalDimension($this->canonicalDimension);
        }

        return null;
    }

    public function getInheritPeriod(): bool
    {
        if ($this->inheritPeriod !== null) {
            return $this->inheritPeriod;
        }

        // Legacy widgets with an explicit period keep their own range until opted in.
        return $this->period === null;
    }

    public function getResolvedPeriod(?string $globalPeriod = null): ?string
    {
        // Dashboard header period is view-scoped and overrides all widgets when present.
        if ($globalPeriod) {
            return $globalPeriod;
        }

        return $this->period;
    }

    public function getPeriodLabel(?string $globalPeriod = null): ?string
    {
        $period = $this->getResolvedPeriod($globalPeriod);

        if ($period) {
            return $this->_getValueForLabel(Options::getPeriodOptions(), $period);
        }

        return null;
    }

    public function getMetricLabel(): ?string
    {
        if ($this->canonicalMetric) {
            return Canonical::getMetricLabel($this->canonicalMetric);
        }

        if ($source = $this->getSource()) {
            if ($this->metric) {
                return $this->_getValueForLabel($source->fetchAvailableMetrics(), $this->metric);
            }
        }

        return null;
    }

    public function getDimensionLabel(): ?string
    {
        if ($this->canonicalDimension) {
            return Canonical::getDimensionLabel($this->canonicalDimension);
        }

        if ($source = $this->getSource()) {
            if ($this->dimension) {
                return $this->_getValueForLabel($source->fetchAvailableDimensions(), $this->dimension);
            }
        }

        return null;
    }

    public function getFrontEndData(): array
    {
        $metricValue = $this->metric;

        if ($this->canonicalMetric) {
            $metricValue = Canonical::valueFromCanonicalKey($this->canonicalMetric);
        }

        $dimensionValue = $this->dimension;

        if ($this->canonicalDimension) {
            $dimensionValue = Canonical::valueFromCanonicalKey($this->canonicalDimension);
        }

        return [
            'id' => $this->id,
            'source' => $this->getSource()?->handle,
            'view' => $this->getView()?->handle,
            'type' => get_class($this),
            'period' => $this->period,
            'inheritPeriod' => $this->getInheritPeriod(),
            'periodLabel' => $this->getPeriodLabel(),
            'metric' => $metricValue,
            'metricLabel' => $this->getMetricLabel(),
            'dimension' => $dimensionValue,
            'dimensionLabel' => $this->getDimensionLabel(),
            'canonicalMetric' => $this->canonicalMetric,
            'canonicalDimension' => $this->canonicalDimension,
            'width' => (string)$this->width,
        ];
    }

    public function getSerializedWidget(): array
    {
        $settings = $this->getSettings();

        // Presets store source by handle in project config (not sourceId).
        if ($source = $this->getSource()) {
            $settings['source'] = $source->handle;
        }

        return $settings;
    }

    public function getWidgetData(?string $globalPeriod = null, bool $refreshCache = false): array
    {
        $dataTypeClass = $this->getDataType();
        $source = $this->getSource();
        $period = $this->getResolvedPeriod($globalPeriod);

        if (!$source) {
            return [];
        }

        if (!$period && $dataTypeClass !== RealtimeData::class) {
            return [];
        }

        $dataType = new $dataTypeClass([
            'widget' => $this,
            'source' => $source,
            'period' => $period,
            'metric' => $this->getResolvedMetric(),
            'dimension' => $this->getResolvedDimension(),
        ]);

        return $dataType->getData($refreshCache);
    }

    public function fetchData(WidgetDataInterface $widgetData): array
    {
        return $this->getSource()->fetchData($widgetData);
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
