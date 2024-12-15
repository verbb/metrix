<?php
namespace verbb\metrix\widgets\data;

use verbb\metrix\base\WidgetData;

class DimensionData extends WidgetData
{
    // Protected Methods
    // =========================================================================

    protected function formatData(array $rawData): array
    {
        $rows = array_map(function ($row) {
            return [
                $row['dimension'] ?? '(not set)',
                (int)($row['metric'] ?? 0),
            ];
        }, $rawData);

        return [
            'cols' => [
                ['type' => 'string', 'label' => ucfirst($this->dimension), 'id' => $this->dimension],
                ['type' => 'integer', 'labelFormat' => 'numberShort', 'label' => ucfirst($this->metric), 'id' => $this->metric],
            ],
            'rows' => $rows,
        ];
    }
}
