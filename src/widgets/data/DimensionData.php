<?php
namespace verbb\metrix\widgets\data;

use verbb\metrix\base\WidgetData;

class DimensionData extends WidgetData
{
    // Protected Methods
    // =========================================================================

    protected function formatData(array $rawData): array
    {
        // Sort by metric descending so row limits keep the most meaningful values.
        arsort($rawData, SORT_NUMERIC);

        $limit = $this->getRowLimit();
        $rawData = array_slice($rawData, 0, $limit, true);

        $rows = array_map(fn($key, $value) => [$key, (int)$value], array_keys($rawData), array_values($rawData));

        return [
            'cols' => [
                ['type' => 'string', 'label' => $this->widget->getDimensionLabel(), 'id' => $this->dimension],
                ['type' => 'integer', 'labelFormat' => 'numberShort', 'label' => $this->widget->getMetricLabel(), 'id' => $this->metric],
            ],
            'rows' => $rows,
        ];
    }
}
