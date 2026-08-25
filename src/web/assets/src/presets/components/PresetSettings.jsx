import { nanoid } from 'nanoid';

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

        // Coerce width so the column picker treats newly added rows like saved ones.
        if (mergedData.width != null) {
            mergedData.width = Number(mergedData.width) || 1;
        }

        const preloaded = preloadWidget(mergedData);

        onSave?.({
            ...preloaded,
            __id: widget.__id || nanoid(),
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
