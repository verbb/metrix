/**
 * Side effects when widget settings fields change (source/type clears, label sync).
 */

const getFieldOptions = (fieldName, field, values, { metrics, dimensions }) => {
    if (fieldName === 'metric') {
        return metrics[values.source] || field?.defaultOptions || field?.options || [];
    }

    if (fieldName === 'dimension') {
        return dimensions[values.source] || field?.defaultOptions || field?.options || [];
    }

    return field?.defaultOptions || field?.options || [];
};

export const applyWidgetFieldEffects = (
    previousValues,
    values,
    {
        rawSchema = [],
        getSettingsByType,
        metrics = {},
        dimensions = {},
        syncLabels = false,
    },
) => {
    // Form state only includes schema fields — preserve labels and other stored keys.
    const updated = { ...previousValues, ...values };
    const formPatches = {};

    if (values.source !== previousValues.source) {
        updated.metric = '';
        updated.dimension = '';
        formPatches.metric = '';
        formPatches.dimension = '';
    }

    if (values.type !== previousValues.type) {
        updated.dimension = '';
        formPatches.dimension = '';
    }

    if (syncLabels) {
        ['metric', 'dimension', 'period'].forEach((fieldName) => {
            if (values[fieldName] === previousValues[fieldName]) {
                return;
            }

            const field = rawSchema.find((entry) => entry.name === fieldName);

            // Realtime and similar types omit metric/period fields — do not wipe server labels.
            if (!field) {
                return;
            }

            const options = getFieldOptions(fieldName, field, values, { metrics, dimensions });
            const option = options.find((entry) => entry.value === values[fieldName]);

            if (fieldName === 'metric') {
                updated.metricLabel = option?.label || '';
            }

            if (fieldName === 'dimension') {
                updated.dimensionLabel = option?.label || '';
            }

            if (fieldName === 'period') {
                updated.periodLabel = option?.label || '';
            }
        });
    }

    return { updated, formPatches };
};
