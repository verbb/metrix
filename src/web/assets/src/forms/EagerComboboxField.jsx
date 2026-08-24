import { useEffect, useState } from 'react';

import { ComboboxInput, Spinner } from '@verbb/plugin-kit-react/components';
import { FieldLayout, useEngineField } from '@verbb/plugin-kit-react/forms';

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
                <ComboboxInput
                    options={options}
                    value={value ?? ''}
                    placeholder={field.placeholder}
                    emptyMessage={field.emptyMessage || Craft.t('metrix', 'No options found.')}
                    isInvalid={isInvalid || Boolean(loadError)}
                    disabled={field.disabled || loading}
                    width={field.width}
                    onValueChange={(nextValue) => {
                        setValue(nextValue);
                        setTouched();
                    }}
                />

                {loading ? <Spinner size="xs" /> : null}
            </div>
        </FieldLayout>
    );
};
