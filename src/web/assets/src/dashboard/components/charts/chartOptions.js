import {
    format, chartFormat, CHART_COLORS, CHART_AXIS_LABEL_COLOR, hexToRgba, WIDGET_HEIGHT,
} from '@utils';

/** Shared double-height chart pane used by line/bar/pie. */
export const CHART_PANE_HEIGHT = `${(WIDGET_HEIGHT * 2) - 2.7}rem`;

export function createAreaFill(color) {
    return (context) => {
        const { chart } = context;
        const { ctx, chartArea } = chart;

        if (!chartArea) {
            return null;
        }

        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);

        gradient.addColorStop(0, hexToRgba(color, '0.2'));
        gradient.addColorStop(1, hexToRgba(color, '0'));

        return gradient;
    };
}

export function getAxisFormatters(cols) {
    return {
        xAxisFormat: chartFormat(cols[0], 'label'),
        xAxisTooltipFormat: chartFormat(cols[0], 'tooltip'),
        yAxisFormat: chartFormat(cols[1], 'label'),
        yAxisTooltipFormat: chartFormat(cols[1], 'tooltip'),
    };
}

export function buildBaseChartOptions({ customTooltip, data, widget, extraPlugins = {} }) {
    return {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
                mode: 'index',
                intersect: false,
                position: 'cursor',
                external: (context) => customTooltip(context, data, widget),
            },
            ...extraPlugins,
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    };
}

export function buildCartesianScales({
    xAxisFormat,
    yAxisFormat,
    style = 'bar',
}) {
    const mirrored = style === 'line';
    const tickColor = mirrored ? CHART_COLORS[0] : CHART_AXIS_LABEL_COLOR;

    return {
        y: {
            beginAtZero: true,
            border: { display: false },
            ticks: {
                mirror: mirrored,
                maxTicksLimit: 10,
                z: mirrored ? 1 : 0,
                color: tickColor,
                ...(mirrored ? {
                    textStrokeColor: '#fff',
                    textStrokeWidth: 3,
                } : {}),
                padding: 5,
                font: { size: 10 },
                callback(value, index) {
                    if (index === 0) {
                        return '';
                    }

                    return format(value, yAxisFormat);
                },
            },
            grid: {
                display: false,
                drawTicks: false,
                drawBorder: false,
            },
        },
        x: {
            border: { display: false },
            ticks: {
                mirror: mirrored,
                autoSkip: true,
                ...(style === 'bar' ? { maxTicksLimit: 8 } : {}),
                color: tickColor,
                ...(mirrored ? {
                    textStrokeColor: '#fff',
                    textStrokeWidth: 3,
                    padding: 0,
                } : { padding: 5 }),
                font: { size: 10 },
                callback(value, index, values) {
                    if (mirrored && (index === 0 || index === values.length - 1)) {
                        return '';
                    }

                    return format(this.getLabelForValue(value), xAxisFormat);
                },
            },
            grid: { display: false },
        },
    };
}

export function buildComparisonLegendPlugin() {
    return {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
            boxWidth: 10,
            boxHeight: 10,
            font: { size: 10 },
            // Filled swatches with a thin stroke — avoids thick/dashed line legend boxes.
            generateLabels(chart) {
                const hiddenOpacity = 0.5;

                return chart.data.datasets.map((dataset, datasetIndex) => {
                    const isVisible = chart.isDatasetVisible(datasetIndex);
                    const opacity = isVisible ? 1 : hiddenOpacity;
                    const borderColor = dataset.borderColor;

                    return {
                        text: dataset.label,
                        fillStyle: hexToRgba(borderColor, String(0.2 * opacity)),
                        strokeStyle: hexToRgba(borderColor, String(opacity)),
                        fontColor: `rgba(55, 65, 81, ${opacity})`,
                        lineWidth: 1,
                        hidden: false,
                        datasetIndex,
                    };
                });
            },
        },
    };
}

export function preprocessPieRows(rows, thresholdPercentage = 1) {
    const totalValue = rows.reduce((sum, row) => sum + row[1], 0);
    const threshold = (thresholdPercentage / 100) * totalValue;
    const groupedRows = [];
    let otherValue = 0;

    rows.forEach((row) => {
        if (row[1] < threshold) {
            otherValue += row[1];
        } else {
            groupedRows.push(row);
        }
    });

    if (otherValue > 0) {
        groupedRows.push([Craft.t('metrix', 'Other'), otherValue]);
    }

    return groupedRows;
}

export function buildPieLegendItems(rows) {
    return rows.map((row, index) => ({
        text: String(row[0]),
        fillStyle: CHART_COLORS[index % CHART_COLORS.length],
        hidden: false,
    }));
}
