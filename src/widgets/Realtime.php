<?php
namespace verbb\metrix\widgets;

use verbb\metrix\Metrix;
use verbb\metrix\base\Widget;
use verbb\metrix\base\WidgetDataInterface;
use verbb\metrix\helpers\Schema;

use Craft;
use craft\helpers\App;

use Throwable;

class Realtime extends Widget
{
    // Static Methods
    // =========================================================================

    public static function supportsCache(): bool
    {
        return false;
    }

    public static function getDataType(): string
    {
        return data\RealtimeData::class;
    }

    public static function getSettingsSchema(): array
    {
        return [
            Schema::sources(),
            Schema::chartTypes(),
            Schema::widths(),
        ];
    }


    // Public Methods
    // =========================================================================

    public function getMetricLabel(): ?string
    {
        return Craft::t('metrix', 'Active users');
    }

    public function fetchData(WidgetDataInterface $widgetData): array
    {
        return $this->getSource()->fetchRealtimeData($widgetData);
    }


}