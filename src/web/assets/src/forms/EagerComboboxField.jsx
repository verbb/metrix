import { useEffect, useMemo, useState } from 'react';

import {
    Combobox,
    ComboboxInput,
    Option,
    OptionGroup,
    Spinner,
} from '@verbb/plugin-kit-react/components';
import { FieldLayout, useEngineField } from '@verbb/plugin-kit-react/forms';

const toStringValue = (value) => (value === undefined || value === null ? '' : String(value));

/**
 * Flat options with a `group` key become labelled option groups in the combobox panel.
 */
function buildGroupedOptions(options) {
    const groups = [];
    const groupIndex = new Map();

    options.forEach((option) => {
        const groupLabel = option.group || '';

        if (!groupIndex.has(groupLabel)) {
            const entry = { group: groupLabel, options: [] };
            groupIndex.set(groupLabel, entry);
            groups.push(entry);
        }

        groupIndex.get(groupLabel).options.push(option);
    });

    return groups;
}

function GroupedComboboxField({
    options,
    value,
    onValueChange,
    field,
    isInvalid,
    loading,
}) {
    const groupedOptions = useMemo(() => buildGroupedOptions(options), [options]);
    const stringValue = toStringValue(value);

    const handleChange = (event) => {
        const raw = event.detail?.value;
        const match = options.find((option) => toStringValue(option.value) === toStringValue(raw));
        onValueChange(match ? match.value : raw ?? null);
    };

    return (
        <Combobox
            value={stringValue}
            placeholder={field.placeholder}
            emptyMessage={field.emptyMessage || Craft.t('metrix', 'No options found.')}
            invalid={isInvalid}
            disabled={field.disabled || loading}
            width={field.width}
            onPkChange={handleChange}
        >
            {groupedOptions.map((group) => (
                <OptionGroup key={group.group || '__default__'} label={group.group}>
                    {group.options.map((option) => (
                        <Option
                            key={toStringValue(option.value)}
                            value={toStringValue(option.value)}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </Option>
                    ))}
                </OptionGroup>
            ))}
        </Combobox>
    );
}

/**
 * SchemaForm `$field: 'eagerCombobox'` — Metrix-owned.
 *
 * Loads the full option list once when the field mounts (or `loadKey` changes),
 * shows a spinner beside the control, then uses PK ComboboxInput in static mode
 * so users can browse + locally filter. Distinct from kit `combobox` + `fetchOptions`
 * typeahead (empty until the user searches).
 */
export const EagerComboboxField = ({ form, field }) => {
    const {
        value, setValue, setTouched, errors, isInvalid,
    } = useEngineField(form, field.name);

    const [options, setOptions] = useState(() => (
        Array.isArray(field.options) ? field.options : []
    ));
    const [loading, setLoading] = useState(typeof field.loadOptions === 'function');
    const [loadError, setLoadError] = useState(null);

    const hasGroupedOptions = useMemo(() => {
        return options.some((option) => Boolean(option.group));
    }, [options]);

    useEffect(() => {
        if (typeof field.loadOptions !== 'function') {
            setLoading(false);
            return undefined;
        }

        let cancelled = false;

        setLoading(true);
        setLoadError(null);

        field.loadOptions()
            .then((fetched) => {
                if (cancelled) {
                    return;
                }

                const nextOptions = Array.isArray(fetched) ? fetched : [];
                setOptions(nextOptions);

                // Keep schema field.options in sync for label side-effects on change.
                field.options = nextOptions;
            })
            .catch((error) => {
                if (cancelled) {
                    return;
                }

                console.error(`Failed to load options for "${field.name}":`, error);
                setOptions([]);
                field.options = [];
                setLoadError(Craft.t('metrix', 'Failed to load options. Please try again.'));
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    // loadKey invalidates when source (etc.) changes; loadOptions is the fetcher for that key.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- field object is stable enough via loadKey
    }, [field.loadKey, field.loadOptions, field.name]);

    const fieldErrors = [
        ...errors,
        ...(loadError ? [loadError] : []),
    ];

    const handleValueChange = (nextValue) => {
        setValue(nextValue);
        setTouched();
    };

    return (
        <FieldLayout
            name={field.name}
            label={field.label}
            instructions={field.instructions}
            warning={field.warning}
            required={field.required}
            errors={fieldErrors}
        >
            <div className="flex items-center gap-2">
                {hasGroupedOptions ? (
                    <GroupedComboboxField
                        options={options}
                        value={value}
                        onValueChange={handleValueChange}
                        field={field}
                        isInvalid={isInvalid || Boolean(loadError)}
                        loading={loading}
                    />
                ) : (
                    <ComboboxInput
                        options={options}
                        value={value ?? ''}
                        placeholder={field.placeholder}
                        emptyMessage={field.emptyMessage || Craft.t('metrix', 'No options found.')}
                        isInvalid={isInvalid || Boolean(loadError)}
                        disabled={field.disabled || loading}
                        width={field.width}
                        onValueChange={handleValueChange}
                    />
                )}

                {loading ? <Spinner size="xs" /> : null}
            </div>
        </FieldLayout>
    );
};
