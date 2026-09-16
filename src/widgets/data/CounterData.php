<?php
namespace verbb\metrix\widgets\data;

use verbb\metrix\base\WidgetData;
use Craft;

class CounterData extends WidgetData
{
    // Protected Methods
    // =========================================================================

    protected function formatData(array $rawData): array
    {
        $total = array_sum($rawData);

        // Check if the period supports previous data
        if ($this->period::previousDisplayName()) {
            $change = $this->calculatePercentageChange($total);

            $previousLabel = Craft::t('metrix', 'from {label}', ['label' => strtolower($this->period::previousDisplayName())]);

            return [
                'cols' => [
                    ['type' => is_float($total) ? 'float' : 'integer', 'labelFormat' => 'numberLong'],
                    ['type' => 'float', 'labelFormat' => 'percentageChange', 'label' => $previousLabel],
                ],
                'rows' => [[$total, $change]],
            ];
        }

        return [
            'cols' => [
                ['type' => is_float($total) ? 'float' : 'integer', 'labelFormat' => 'numberLong'],
            ],
            'rows' => [[$total]],
        ];
    }

    protected function calculatePercentageChange(int|float $currentValue): float
    {
        $previousPeriodRange = $this->period::getPreviousDateRange();
        $originalRange = $this->period::$currentDateRange;
        // Retain the view scope and cache policy when comparing the same audience.
        $previousWidgetData = clone $this;

        try {
            $this->period::$currentDateRange = $previousPeriodRange;

            $previousData = $previousWidgetData->remember(
                'previous',
                fn() => $this->source->fetchData($previousWidgetData),
            );
        } finally {
            $this->period::$currentDateRange = $originalRange;
        }

        $previousValue = array_sum($previousData);

        if (!$previousValue) {
            return 0.0;
        }

        return round((($currentValue - $previousValue) / $previousValue) * 100, 2);
    }
}
