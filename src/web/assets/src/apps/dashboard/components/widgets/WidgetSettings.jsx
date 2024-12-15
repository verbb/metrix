import { useState, useEffect, useRef } from 'react';
import { isEqual } from 'lodash-es';

import {
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@components/ui/Dialog';

import LoadingSpinner from '@components/LoadingSpinner';
import { Button } from '@components/ui/Button';
import { DynamicForm } from '@components/forms/DynamicForm';

import useAppStore from '@dashboard/hooks/useAppStore';
import useWidgetStore from '@dashboard/hooks/useWidgetStore';
import useWidgetSettingsStore from '@dashboard/hooks/useWidgetSettingsStore';

import { cn, api } from '@utils';
import { preloadWidget } from '@utils/widgets';

export function WidgetSettings({
    widget = {},
    onClose,
    isNew = false,
    newWidget,
}) {
    const formRef = useRef(null);

    const currentView = useAppStore((state) => { return state.currentView; });

    const addWidget = useWidgetStore((state) => { return state.addWidget; });
    const updateWidgetState = useWidgetStore((state) => { return state.updateWidgetState; });

    const {
        getSettingsByType,
        fetchMetrics,
        fetchDimensions,
        metrics,
        dimensions,
    } = useWidgetSettingsStore();

    const initialWidget = isNew ? newWidget : widget.data;

    // Maintain a local copy of the widget data
    const [localData, setLocalData] = useState(initialWidget);
    const [currentSchema, setCurrentSchema] = useState([]);
    const [formErrors, setFormErrors] = useState(null); // Server-side errors
    const [loading, setLoading] = useState(false);

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

            return updatedData;
        });
    };

    const handleFormSubmit = async(data) => {
        setLoading(true);
        setFormErrors(null);

        const payload = {
            id: localData.id,
            widget: {
                ...data,
                view: currentView,
            },
        };

        // Has the data even changed? don't bother saving or triggering refresh
        const updatedData = { ...widget.data, ...data };

        if (isEqual(widget.data, updatedData)) {
            if (onClose) {
                onClose();
            }

            return;
        }

        updateWidgetState(widget, {
            waitForData: true,
        });

        try {
            const response = await api.post('save-widget', payload);

            if (response.errors) {
                setFormErrors(response.errors);
            } else {
                const preloadedWidget = preloadWidget(response.data);

                // Save to the store
                if (isNew) {
                    addWidget(preloadedWidget);
                } else {
                    updateWidgetState(widget, {
                        ...preloadedWidget,
                        waitForData: false,
                    });
                }

                if (onClose) {
                    onClose();
                }
            }
        } catch (error) {
            console.error('Failed to save widget:', error);

            const generalError = error.response?.data?.message || 'An unexpected error occurred. Please try again later.';

            setFormErrors({ general: generalError });
        } finally {
            setLoading(false);
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

                    <Button variant="primary" type="submit" disabled={loading} onClick={handleSave}>
                        {loading && (
                            <LoadingSpinner size="tiny" className="mc-border-t-white mc-border-r-white" />
                        )}

                        {!loading && (isNew ? Craft.t('metrix', 'Create') : Craft.t('metrix', 'Save'))}
                    </Button>
                </div>
            </DialogFooter>
        </>
    );
}
