import { useState, useEffect, useRef, useCallback } from 'react';

import useWidgetSettingsStore from '@dashboard/hooks/useWidgetSettingsStore';

import { applyWidgetFieldEffects } from '@utils/widgetFieldEffects';

/**
 * Shared widget settings form state for dashboard and preset editors.
 */
export function useWidgetSettingsForm({
    widget = {},
    isNew = false,
    newWidget,
    syncLabels = false,
}) {
    const formRef = useRef(null);
    const previousValuesRef = useRef(null);

    const { getSettingsByType, metrics, dimensions } = useWidgetSettingsStore();

    const initialWidget = isNew ? newWidget : widget.data;

    const [localData, setLocalData] = useState(initialWidget);
    const [currentSchema, setCurrentSchema] = useState([]);
    const [formErrors, setFormErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const schema = getSettingsByType(localData.type, localData.source);
        setCurrentSchema(schema);
    }, [localData.type, localData.source, getSettingsByType]);

    const handleValuesChange = useCallback((values, formApi) => {
        const previousValues = previousValuesRef.current ?? values;
        const { updated, formPatches } = applyWidgetFieldEffects(previousValues, values, {
            rawSchema: currentSchema,
            getSettingsByType,
            metrics,
            dimensions,
            syncLabels,
        });

        Object.entries(formPatches).forEach(([name, value]) => {
            if (formApi.getFieldValue(name) !== value) {
                formApi.setFieldValue(name, value);
            }
        });

        previousValuesRef.current = updated;
        setLocalData(updated);
    }, [currentSchema, dimensions, getSettingsByType, metrics, syncLabels]);

    useEffect(() => {
        previousValuesRef.current = localData;
    }, [localData.type, localData.source]);

    const mergeFormData = useCallback((data) => {
        return { ...widget.data, ...localData, ...data };
    }, [localData, widget.data]);

    const handleSave = useCallback(() => {
        formRef.current?.handleSubmit();
    }, []);

    return {
        formRef,
        localData,
        currentSchema,
        formErrors,
        setFormErrors,
        loading,
        setLoading,
        handleValuesChange,
        mergeFormData,
        handleSave,
    };
}
