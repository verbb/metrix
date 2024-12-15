<?php
namespace verbb\metrix\models;

use verbb\metrix\Metrix;
use verbb\metrix\base\Widget;
use verbb\metrix\base\WidgetInterface;
use verbb\metrix\helpers\Options;
use verbb\metrix\periods\Today;
use verbb\metrix\widgets\Line;

use Craft;
use craft\base\Model;
use craft\helpers\ArrayHelper;
use craft\helpers\DateTimeHelper;

use DateInterval;

class Settings extends Model
{
    // Properties
    // =========================================================================

    public string $pluginName = 'Metrix';
    public bool $hasCpSection = true;
    public bool $enableCache = true;
    public string $cacheDuration = 'PT10M';
    public int $realtimeInterval = 10;
    public array $defaultWidgetConfig = [];
    public array|string $enabledWidgetTypes = '*';
    public array $enabledPeriods = []; // Set via config
    public array $periodSettings = [];


    // Public Methods
    // =========================================================================

    public function init(): void
    {
        if (!$this->defaultWidgetConfig) {
            $this->defaultWidgetConfig = [
                'type' => Line::class,
                'period' => Today::class,
                'width' => 1,
            ];
        }

        parent::init();
    }

    public function getWidgetTypeOptions(): array
    {
        return Options::getWidgetTypeOptions();
    }

    public function getEnabledWidgetTypes(): array
    {
        if ($this->enabledWidgetTypes === '*') {
            return Metrix::$plugin->getWidgets()->getAllWidgetTypes();
        }

        if (is_array($this->enabledWidgetTypes)) {
            return $this->enabledWidgetTypes;
        }

        return Metrix::$plugin->getWidgets()->getAllWidgetTypes();
    }

    public function getWidgetPeriodOptions(): array
    {
        return Options::getPeriodOptions();
    }

    public function getWidgetWidthOptions(): array
    {
        return Options::getWidthOptions();
    }

    public function getPeriodSettingsRows(): array
    {
        $rows = [];

        $periodSettings = $this->periodSettings;

        // Check for config file-specific values, which are defined in a more DX-friendly format
        // but needs to be normalized as if we've saved it through the table UI.
        if ($this->enabledPeriods) {
            $periodSettings = [];

            foreach ($this->enabledPeriods as $groupKey => $group) {
                foreach ($group as $period) {
                    $periodSettings[$period] = [
                        'id' => $period,
                        'enabled' => true,
                    ];
                }

                if ($groupKey < (count($this->enabledPeriods) - 1)) {
                    $periodSettings['divider' . $groupKey] = [
                        'id' => 'divider' . $groupKey,
                        'enabled' => true,
                    ];
                }
            }
        }

        $types = Metrix::$plugin->getPeriods()->getGroupedPeriodTypes();
        $values = $periodSettings ? ArrayHelper::index($periodSettings, 'id') : null;

        foreach ($types as $groupKey => $group) {
            foreach ($group as $period) {
                $isEnabled = true;

                if (is_array($values)) {
                    $isEnabled = $values[$period]['enabled'] ?? null;
                }

                $rows[] = [
                    'id' => $period,
                    'type' => $period::displayName(),
                    'enabled' => $isEnabled,
                ];
            }

            $isEnabled = true;

            if (is_array($values)) {
                $isEnabled = $values['divider' . $groupKey]['enabled'] ?? null;
            }

            if ($groupKey < (count($types) - 1)) {
                $rows[] = [
                    'id' => 'divider' . $groupKey,
                    'type' => [
                        'value' => '',
                        'class' => 'is-divider',
                    ],
                    'enabled' => $isEnabled,
                ];
            }
        }

        // Ensure that we re-order rows based on saved data.
        $savedOrder = array_column($periodSettings, 'id');

        usort($rows, function ($a, $b) use ($savedOrder) {
            $indexA = array_search($a['id'], $savedOrder);
            $indexB = array_search($b['id'], $savedOrder);

            // If an item is not in $savedOrder, it should retain the default order
            $indexA = $indexA === false ? PHP_INT_MAX : $indexA;
            $indexB = $indexB === false ? PHP_INT_MAX : $indexB;

            return $indexA <=> $indexB;
        });

        return $rows;
    }

    public function getEnabledPeriods(): array
    {
        $nested = [];
        $currentGroup = [];

        // Convert flat structure to nested one
        foreach ($this->getPeriodSettingsRows() as $item) {
            if (str_starts_with($item['id'], 'divider')) {
                // If it's a divider, start a new group
                if (!empty($currentGroup)) {
                    $nested[] = $currentGroup;
                    $currentGroup = [];
                }
            } else if ($item['enabled']) {
                // Add enabled items to the current group
                $currentGroup[] = $item['id'];
            }
        }

        // Add the last group if it's not empty
        if (!empty($currentGroup)) {
            $nested[] = $currentGroup;
        }

        return $nested;
    }

    public function getNewWidgetConfig(): array
    {
        $defaultWidget = Metrix::$plugin->getWidgets()->createWidget($this->defaultWidgetConfig);

        $firstSource = Metrix::$plugin->getSources()->getAllConfiguredSources()[0] ?? null;

        if ($firstSource) {
            $defaultWidget->setSource($firstSource);
        }

        return $defaultWidget->getFrontEndData();
    }

    public function getCacheDuration(): int
    {
        if (!$this->enableCache) {
            return 1;
        }

        return DateTimeHelper::intervalToSeconds(new DateInterval($this->cacheDuration));
    }

    public function getRealtimeInterval(): int
    {
        return $this->realtimeInterval * 1000;
    }
}
