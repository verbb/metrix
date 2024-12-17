<?php
namespace verbb\metrix\widgets\data;

use verbb\metrix\base\WidgetData;
use verbb\metrix\base\WidgetDataInterface;

use Craft;

class RealtimeData extends WidgetData
{
    // Protected Methods
    // =========================================================================

    protected function formatData(array $rawData): array
    {
        $label = array_keys($rawData)[0] ?? null;
        $value = array_values($rawData)[0] ?? null;

        return [
            'cols' => [
                ['type' => 'integer', 'labelFormat' => 'numberLong', 'label' => $label],
            ],
            'rows' => [[(int)$value]],
        ];
    }
}
