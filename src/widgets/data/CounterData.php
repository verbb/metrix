<?php
namespace verbb\metrix\widgets\data;

use verbb\metrix\base\WidgetData;
use verbb\metrix\Metrix;

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
        $previousPeriodRange = $this->period::getPreviousDateRange();
        $originalRange = $this->period::$currentDateRange;
        $cacheDuration = Metrix::$plugin->getSettings()->getCacheDuration();
        $previousWidgetData = new static([
            'widget' => $this->widget,
            'source' => $this->source,
            'period' => $this->period,
            'metric' => $this->metric,
            'dimension' => $this->dimension,
        ]);

        try {
            $this->period::$currentDateRange = $previousPeriodRange;

            $previousData = Craft::$app->getCache()->getOrSet(
                $previousWidgetData->getCacheKey('previous'),
                fn() => $this->source->fetchData($previousWidgetData),
                $cacheDuration,
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
