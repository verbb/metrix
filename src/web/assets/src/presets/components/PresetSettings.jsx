import { WidgetSettingsShell } from '@components/WidgetSettingsShell';

import { useWidgetSettingsForm } from '@hooks/useWidgetSettingsForm';
import { preloadWidget } from '@utils/widgets';

export function PresetSettings({
    widget = {},
    onClose,
    onSave,
    isNew = false,
    newWidget,
}) {
    const {
        formRef,
        localData,
        currentSchema,
        handleValuesChange,
        mergeFormData,
        handleSave,
    } = useWidgetSettingsForm({
        widget,
        isNew,
        newWidget,
        syncLabels: true,
    });

    const handleFormSubmit = (data) => {
        const mergedData = mergeFormData(data);
        const preloaded = preloadWidget(mergedData);

        onSave?.({
            ...preloaded,
            __id: widget.__id,
        });
        onClose?.();
    };

    return (
        <WidgetSettingsShell
            formRef={formRef}
            currentSchema={currentSchema}
            localData={localData}
            onSubmit={handleFormSubmit}
            onValuesChange={handleValuesChange}
            onClose={onClose}
            onSave={handleSave}
            isNew={isNew}
        />
    );
}
