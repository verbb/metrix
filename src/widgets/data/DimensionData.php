<?php
namespace verbb\metrix\widgets\data;

use verbb\metrix\base\WidgetData;

class DimensionData extends WidgetData
{
    // Protected Methods
    // =========================================================================

    protected function formatData(array $rawData): array
    {
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
