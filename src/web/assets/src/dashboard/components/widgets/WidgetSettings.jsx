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
    const currentView = useAppStore((state) => state.currentView);

    const addWidget = useWidgetStore((state) => state.addWidget);
    const updateWidgetState = useWidgetStore((state) => state.updateWidget);

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
        setLoading(true);
        setFormErrors(null);

        const mergedData = mergeFormData(data);

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

        const typeChanged = mergedData.type !== widget.data.type;

        updateWidgetState(widget, {
            waitForData: true,
            // Bar → Line keeps stale Chart.js state on the same canvas; drop cached rows until refetch.
            ...(typeChanged && { chartData: null }),
        });

        try {
            const response = await api.post('save-widget', payload);

            if (response.errors) {
                setFormErrors(response.errors);
            } else {
                const preloadedWidget = preloadWidget(response.data);

                if (isNew) {
                    addWidget(preloadedWidget);
                } else {
                    updateWidgetState(widget, {
                        ...preloadedWidget,
                        waitForData: false,
                        ...(typeChanged && { chartData: null }),
                    });
                }

                onClose?.();
            }
        } catch (error) {
            console.error('Failed to save widget:', error);

            const generalError = error.response?.data?.message
                || 'An unexpected error occurred. Please try again later.';

            setFormErrors({ general: generalError });
        } finally {
            setLoading(false);
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
