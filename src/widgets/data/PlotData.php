<?php
namespace verbb\metrix\widgets\data;

use verbb\metrix\base\WidgetData;

use Craft;

class PlotData extends WidgetData
{
    // Protected Methods
    // =========================================================================

    protected function formatData(array $rawData): array
    {
        $rows = array_map(function ($row) {
            $dimension = $row['dimension'] ?? null;

            // Use the period's method to format the dimension value
            $dimension = $this->period::formatPlotDimension($dimension);

            return [
                $dimension,
                (int)($row['metric'] ?? 0),
            ];
        }, $rawData);

        // Just in case it's not in the correct order, sort
        usort($rows, function ($a, $b) {
            return strcmp($a[0], $b[0]);
        });

        $chartMetadata = $this->period::getChartMetadata();

        return [
            'cols' => [
                [
                    'type' => 'date',
                    'labelFormat' => $chartMetadata['xAxisLabelFormat'],
                    'tooltipFormat' => $chartMetadata['tooltipFormat'],
                    'label' => Craft::t('metrix', 'Date'),
                    'id' => 'date',
                ],
                [
                    'type' => 'integer',
                    'labelFormat' => 'numberShort',
                    'tooltipFormat' => 'numberLong',
                    'label' => ucfirst($this->metric),
                    'id' => $this->metric,
                ],
            ],
            'rows' => $rows,
        ];
    }
}
