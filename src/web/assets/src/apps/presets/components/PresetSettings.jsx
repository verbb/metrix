import { useState, useEffect, useRef } from 'react';

import {
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@components/ui/Dialog';

import { Button } from '@components/ui/Button';
import { DynamicForm } from '@components/forms/DynamicForm';

import useAppStore from '@presets/hooks/useAppStore';
import useWidgetSettingsStore from '@presets/hooks/useWidgetSettingsStore';

import { cn } from '@utils';
import { preloadWidget } from '@utils/widgets';

export function PresetSettings({
    widget = {},
    onClose,
    onSave,
    isNew = false,
    newWidget,
}) {
    const formRef = useRef(null);

    const { getSettingsByType } = useWidgetSettingsStore();

    const initialWidget = isNew ? newWidget : widget.data;

    // Maintain a local copy of the widget data
    const [localData, setLocalData] = useState(initialWidget);
    const [currentSchema, setCurrentSchema] = useState([]);

    useEffect(() => {
        const schema = getSettingsByType(localData.type, localData.source);

        setCurrentSchema(schema);
    }, [localData.type, localData.source, getSettingsByType]);

    const handleFieldChange = (value, field, rhfField) => {
        setLocalData((prev) => {
            const updatedData = {
                ...prev,
                [field.name]: value,
            };

            // Changing sources means the metric/dimension is no longer valid
            if (field.name === 'source') {
                updatedData.metric = '';
                updatedData.dimension = '';
            }

            // Update schema if the type changes
            if (field.name === 'type') {
                updatedData.component = getSettingsByType(value).component;

                // Dimension doesn't exist for all types, better to reset
                updatedData.dimension = '';
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

            return updatedData;
        });
    };

    const handleFormSubmit = (data) => {
        // Merge form data with local data
        const updatedWidget = {
            ...widget,
            data: { ...localData, ...data },
        };

        // Pass updated widget back to parent
        if (onSave) {
            onSave(updatedWidget);
        }

        // Close the dialog
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
        if (onClose) {
            onClose();
        }
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>{isNew ? Craft.t('metrix', 'Add New Widget') : Craft.t('metrix', 'Widget Settings')}</DialogTitle>

                <DialogDescription className="mc-sr-only">
                    {isNew ? Craft.t('metrix', 'Create a new widget.') : Craft.t('metrix', 'Modify widget settings.')}
                </DialogDescription>
            </DialogHeader>

            <div className="mc-p-4 mc-space-y-4 mc-min-h-[250px] mc-max-h-[65vh] mc-overflow-auto">
                {currentSchema.length ? (
                    <DynamicForm
                        ref={formRef}
                        schema={currentSchema}
                        data={localData}
                        onSubmit={handleFormSubmit}
                        onFieldChange={handleFieldChange}
                    />
                ) : ''}
            </div>

            <DialogFooter>
                <div className="mc-flex mc-justify-end mc-gap-2">
                    <Button variant="secondary" onClick={handleCancel}>{Craft.t('metrix', 'Cancel')}</Button>

                    <Button variant="primary" type="submit" onClick={handleSave}>
                        {isNew ? Craft.t('metrix', 'Create') : Craft.t('metrix', 'Save')}
                    </Button>
                </div>
            </DialogFooter>
        </>
    );
}
