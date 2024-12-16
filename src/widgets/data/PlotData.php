<?php
namespace verbb\metrix\widgets\data;

use verbb\metrix\base\WidgetData;

use Craft;

use DateTime;

class PlotData extends WidgetData
{
    // Protected Methods
    // =========================================================================

    protected function formatData(array $rawData): array
    {
        $rows = [];

        $now = new DateTime();

        // Generate all possible dimensions for the current period
        foreach ($this->period::generatePlotDimensions() as $dimension) {
            $defaultValue = new DateTime($dimension) < $now ? 0 : null;

            $rows[] = [
                $dimension,
                $rawData[$dimension] ?? $defaultValue,
            ];
        }

        // Sort rows just in case
        usort($rows, function ($a, $b) {
            return strcmp($a[0], $b[0]);
        });

        // Chart metadata from the period
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
                    'label' => $this->widget->getMetricLabel(),
                    'id' => $this->metric,
                ],
            ],
            'rows' => $rows,
        ];
    }
}
