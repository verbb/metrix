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
        $comparisonRows = [];

        $now = new DateTime();

        // Generate all possible dimensions for the current period
        foreach ($this->period::generatePlotDimensions($this, $rawData) as $dimension) {
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

        $cols = [
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
        ];

        if ($this->period::previousDisplayName()) {
            $previousRawData = $this->_fetchPreviousPeriodData();
            $previousDimensions = $this->period::withDateRange(
                $this->period::getPreviousDateRange(),
                fn() => $this->period::generatePlotDimensions($this, $previousRawData),
            );

            // Align by bucket index — previous period uses different date keys than the current x-axis.
            foreach ($rows as $index => $row) {
                $previousDimension = $previousDimensions[$index] ?? null;
                $comparisonValue = 0;

                if ($previousDimension !== null) {
                    $comparisonValue = $previousRawData[$previousDimension] ?? 0;
                }

                $comparisonRows[] = [
                    $row[0],
                    $comparisonValue,
                ];
            }

            $cols[] = [
                'type' => 'integer',
                'labelFormat' => 'numberShort',
                'tooltipFormat' => 'numberLong',
                'label' => Craft::t('metrix', 'Previous period'),
                'id' => 'previous',
            ];
        }

        $payload = [
            'cols' => $cols,
            'rows' => $rows,
        ];

        if ($comparisonRows) {
            $payload['comparisonRows'] = $comparisonRows;
        }

        return $payload;
    }

    /**
     * Cached previous-period fetch — mirrors CounterData but returns the raw keyed map.
     */
    private function _fetchPreviousPeriodData(): array
    {
        $previousPeriodRange = $this->period::getPreviousDateRange();
        $previousWidgetData = new static([
            'widget' => $this->widget,
            'source' => $this->source,
            'period' => $this->period,
            'metric' => $this->metric,
            'dimension' => $this->dimension,
            'limit' => $this->limit,
        ]);

        return $this->period::withDateRange(
            $previousPeriodRange,
            fn() => $previousWidgetData->remember(
                'previous',
                fn() => $this->source->fetchData($previousWidgetData),
            ),
        );
    }
}
