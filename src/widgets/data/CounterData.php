<?php
namespace verbb\metrix\widgets\data;

use verbb\metrix\base\WidgetData;
use verbb\metrix\base\WidgetDataInterface;

use Craft;

class CounterData extends WidgetData
{
    // Protected Methods
    // =========================================================================

    protected function formatData(array $rawData): array
    {
        $total = 0;

        foreach ($rawData as $data) {
            $total += (int)($data['metric'] ?? 0);
        }

        // Check if the period supports previous data
        if ($this->period::previousDisplayName()) {
            $change = $this->calculatePercentageChange($total);

            $previousLabel = Craft::t('metrix', 'from {label}', ['label' => strtolower($this->period::previousDisplayName())]);

            return [
                'cols' => [
                    ['type' => 'integer', 'labelFormat' => 'numberLong'],
                    ['type' => 'float', 'labelFormat' => 'percentageChange', 'label' => $previousLabel],
                ],
                'rows' => [[(int)$total, $change]],
            ];
        }

        return [
            'cols' => [
                ['type' => 'integer', 'labelFormat' => 'numberLong'],
            ],
            'rows' => [[(int)$total]],
        ];
    }

    protected function calculatePercentageChange(int $currentValue): float
    {
        // Fetch the previous period's data
        $previousPeriodRange = $this->period::getPreviousDateRange();

        // Change the period's current date range for sources to handle
        $this->period::$currentDateRange = $previousPeriodRange;

        $previousData = $this->source->fetchData(new static([
            'widget' => $this->widget,
            'source' => $this->source,
            'period' => $this->period,
            'metric' => $this->metric,
            'dimension' => $this->dimension,
        ]));

        $previousValue = 0;

        foreach ($previousData as $data) {
            $previousValue += (float)($data['metric'] ?? 0);
        }

        if (!$previousValue) {
            return 0.0;
        }

        return round((($currentValue - $previousValue) / $previousValue) * 100, 2);
    }
}
