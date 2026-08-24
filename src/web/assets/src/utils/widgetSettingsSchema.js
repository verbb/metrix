/**
 * Adapt Metrix PHP widget settings (`type`, `validation`) to Plugin Kit SchemaForm (`$field`, `required`).
 */

const METRIX_FIELD_TYPES = new Set([
    'text',
    'select',
    'combobox',
    'checkbox',
    'hidden',
]);

const normalizeMetrixField = (field) => {
    if (!field?.name || !METRIX_FIELD_TYPES.has(field.type)) {
        return null;
    }

    // Hidden values stay in form state but are not rendered by SchemaFormEngine.
    if (field.type === 'hidden') {
        return null;
    }

    // Eager-load lists (metrics/dimensions): Metrix `$field: eagerCombobox`, not kit typeahead async.
    if (typeof field.fetchOptions === 'function' || typeof field.loadOptions === 'function') {
        return {
            $field: 'eagerCombobox',
            name: field.name,
            label: field.label,
            instructions: field.instructions,
            placeholder: field.placeholder,
            required: Boolean(field.validation?.required),
            emptyMessage: Craft.t('metrix', 'No options found.'),
            loadOptions: field.loadOptions || field.fetchOptions,
            loadKey: field.loadKey ?? '',
            options: Array.isArray(field.options) ? field.options : [],
        };
    }

    const normalized = {
        $field: field.type,
        name: field.name,
        label: field.label,
        instructions: field.instructions,
        placeholder: field.placeholder,
    };

    if (Array.isArray(field.options) && field.options.length) {
        normalized.options = field.options;
    }

    if (field.validation?.required) {
        normalized.required = true;
    }

    return normalized;
};

export const buildWidgetSettingsSchemaIndex = (rawFields = []) => {
    const schema = rawFields
        .map(normalizeMetrixField)
        .filter(Boolean);

    return {
        schema,
        fieldEntries: schema.map((field) => ({
            path: field.name,
            field,
        })),
    };
};

export const buildWidgetSettingsDefaultValues = (rawFields = [], data = {}) => {
    return rawFields.reduce((values, field) => {
        if (!field?.name) {
            return values;
        }

        if (field.type === 'hidden') {
            values[field.name] = data[field.name] ?? field.value ?? '';
            return values;
        }

        values[field.name] = data[field.name] ?? '';
        return values;
    }, {});
};

export const getWidgetSettingsSchemaKey = (rawFields = []) => {
    return rawFields.map((field) => field.name).join('|');
};
