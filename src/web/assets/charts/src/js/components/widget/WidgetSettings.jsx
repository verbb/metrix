import { useState, useEffect, useRef } from 'react';

import {
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@components/ui/Dialog';

import { Button } from '@components/ui/Button';
import { DynamicForm } from '@components/forms/DynamicForm';

import useWidgetStore from '@hooks/useWidgetStore';
import useWidgetSettingsStore from '@hooks/useWidgetSettingsStore';

import { preloadWidget } from '@utils/widgets';

export function WidgetSettings({
    widget = {},
    onClose,
    isNew = false,
    newWidget,
}) {
    const formRef = useRef(null);

    const addWidget = useWidgetStore((state) => { return state.addWidget; });
    const updateWidget = useWidgetStore((state) => { return state.updateWidget; });

    const {
        getSettingsByType,
        fetchMetrics,
        fetchDimensions,
        metrics,
        dimensions,
    } = useWidgetSettingsStore();

    const existingWidget = widget;
    const initialWidget = !isNew ? existingWidget : newWidget;

    // Maintain a local copy of the widget data
    const [localData, setLocalData] = useState(initialWidget);
    const [currentSchema, setCurrentSchema] = useState([]);
    const [formResetKey, setFormResetKey] = useState(0); // Force remount form on reset

    useEffect(() => {
        // Update schema based on the widget type
        const schema = getSettingsByType(localData.type);

        setCurrentSchema(
            schema.map((field) => {
                if (field.name === 'metric') {
                    return {
                        ...field,
                        async: true,
                        fetchOptions: () => { return fetchMetrics(localData.source); },
                        defaultOptions: metrics[localData.source] || [],
                    };
                }

                if (field.name === 'dimension') {
                    return {
                        ...field,
                        async: true,
                        fetchOptions: () => { return fetchDimensions(localData.source); },
                        defaultOptions: dimensions[localData.source] || [],
                    };
                }

                return field;
            }),
        );
    }, [localData.type, localData.source, getSettingsByType, fetchMetrics, fetchDimensions, metrics, dimensions]);

    const handleFieldChange = (value, field, rhfField) => {
        setLocalData((prev) => {
            const updatedData = {
                ...prev,
                [field.name]: value,
            };

            if (field.name === 'source') {
                updatedData.metric = '';
                updatedData.metricLabel = '';
                updatedData.dimension = '';
                updatedData.dimensionLabel = '';
            }

            // Update label for select fields
            if (['metric', 'dimension', 'period'].includes(field.name)) {
                const option = (field.defaultOptions || field.options || []).find((option) => {
                    return option.value === value;
                });

                if (field.name === 'metric') {
                    updatedData.metricLabel = option?.label || '';
                }

                if (field.name === 'dimension') {
                    updatedData.dimensionLabel = option?.label || '';
                }

                if (field.name === 'period') {
                    updatedData.periodLabel = option?.label || '';
                }
            }

            // Update schema if the type changes
            if (field.name === 'type') {
                updatedData.component = getSettingsByType(value).component;
            }

            return updatedData;
        });
    };

    const handleFormSubmit = (data) => {
        // Sync the `type` and `component` field
        // Merge labels from `localData` into form data
        const updatedData = preloadWidget({
            ...data,
            metricLabel: localData.metricLabel,
            dimensionLabel: localData.dimensionLabel,
            periodLabel: localData.periodLabel,
        });

        if (isNew) {
            addWidget({ ...newWidget, ...updatedData });
        } else {
            updateWidget(widget.__id, updatedData);
        }

        if (onClose) {
            onClose();
        }
    };

    const handleSave = () => {
        // Detached submit button means a little extra work
        if (formRef.current) {
            formRef.current.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true }),
            );
        }
    };

    const handleCancel = () => {
        setLocalData(initialWidget);

        if (onClose) {
            onClose();
        }
    };

    const preppedSchema = currentSchema.map((field) => {
        if (field.name === 'metric') {
            return {
                ...field,
                async: true,
                fetchOptions: () => { return fetchMetrics(localData.source); },
                defaultOptions: metrics[localData.source] || [],
            };
        }

        if (field.name === 'dimension') {
            return {
                ...field,
                async: true,
                fetchOptions: () => { return fetchDimensions(localData.source); },
                defaultOptions: dimensions[localData.source] || [],
            };
        }

        return field;
    });

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{isNew ? 'Add New Widget' : 'Widget Settings'}</DialogTitle>

                <DialogDescription className="mc-sr-only">
                    {isNew ? 'Create a new widget.' : 'Modify widget settings.'}
                </DialogDescription>
            </DialogHeader>

            <div className="mc-p-4 mc-space-y-4 mc-max-h-[65vh] mc-overflow-auto">
                {preppedSchema.length ? (
                    <DynamicForm
                        ref={formRef}
                        schema={preppedSchema}
                        data={localData}
                        onSubmit={handleFormSubmit}
                        onFieldChange={handleFieldChange}
                    />
                ) : ''}
            </div>

            <DialogFooter>
                <div className="mc-flex mc-justify-end mc-gap-2">
                    <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                    <Button variant="primary" type="submit" onClick={handleSave}>{isNew ? 'Create' : 'Save'}</Button>
                </div>
            </DialogFooter>
        </DialogContent>
    );
}
