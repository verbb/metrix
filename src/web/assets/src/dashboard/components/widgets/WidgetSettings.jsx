import { useEffect, useRef } from 'react';
import { isEqual } from 'lodash-es';

import { WidgetSettingsShell } from '@components/WidgetSettingsShell';

import useAppStore from '@dashboard/hooks/useAppStore';
import useWidgetStore from '@dashboard/hooks/useWidgetStore';
import { useWidgetSettingsForm } from '@hooks/useWidgetSettingsForm';

import { api } from '@utils';
import { preloadWidget } from '@utils/widgets';

export function WidgetSettings({
    widget = {},
    onClose,
    isNew = false,
    newWidget,
}) {
    const active = useRef(true);
    useEffect(() => {
        active.current = true;
        return () => { active.current = false; };
    }, []);

    const currentView = useAppStore((state) => state.currentView);

    const addWidget = useWidgetStore((state) => state.addWidget);
    const updateWidgetState = useWidgetStore((state) => state.updateWidgetState);

    const {
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
    } = useWidgetSettingsForm({ widget, isNew, newWidget });

    const handleFormSubmit = async(data) => {
        const mergedData = mergeFormData(data);
        const collectionGeneration = useWidgetStore.getState().collectionGeneration;

        const payload = {
            id: mergedData.id,
            widget: {
                ...mergedData,
                view: currentView,
            },
        };

        if (isEqual(widget.data, mergedData)) {
            onClose?.();
            return;
        }

        setLoading(true);
        setFormErrors(null);

        try {
            const response = await api.post('save-widget', payload);

            if (useAppStore.getState().currentView !== currentView
                || useWidgetStore.getState().collectionGeneration !== collectionGeneration) {
                return;
            }

            if (response.errors) {
                if (active.current) setFormErrors(response.errors);
            } else {
                const preloadedWidget = preloadWidget(response.data);

                if (isNew) {
                    addWidget(preloadedWidget);
                } else {
                    updateWidgetState(widget, {
                        ...preloadedWidget,
                        waitForData: false,
                        chartData: null,
                        error: null,
                        loading: true,
                    });
                }

                if (active.current) onClose?.();
            }
        } catch (error) {
            console.error('Failed to save widget:', error);

            const generalError = error.response?.data?.message
                || 'An unexpected error occurred. Please try again later.';

            if (active.current) setFormErrors({ general: generalError });
        } finally {
            if (active.current) setLoading(false);
        }
    };

    return (
        <WidgetSettingsShell
            formRef={formRef}
            currentSchema={currentSchema}
            localData={localData}
            formErrors={formErrors}
            onSubmit={handleFormSubmit}
            onValuesChange={handleValuesChange}
            onClose={onClose}
            onSave={handleSave}
            loading={loading}
            isNew={isNew}
        />
    );
}
