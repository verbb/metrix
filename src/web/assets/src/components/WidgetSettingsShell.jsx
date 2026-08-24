import { Button } from '@verbb/plugin-kit-react/components';

import { WidgetSettingsForm } from '@components/WidgetSettingsForm';

export function WidgetSettingsShell({
    formRef,
    currentSchema,
    localData,
    formErrors,
    onSubmit,
    onValuesChange,
    onClose,
    onSave,
    loading = false,
    isNew = false,
}) {
    return (
        <>
            {currentSchema.length ? (
                <WidgetSettingsForm
                    ref={formRef}
                    rawSchema={currentSchema}
                    data={localData}
                    errors={formErrors}
                    onSubmit={onSubmit}
                    onValuesChange={onValuesChange}
                />
            ) : null}

            <Button slot="footer" type="button" onClick={onClose}>
                {Craft.t('metrix', 'Cancel')}
            </Button>

            <Button
                slot="footer"
                type="button"
                variant="primary"
                loading={loading}
                disabled={loading}
                onClick={onSave}
            >
                {isNew ? Craft.t('metrix', 'Create') : Craft.t('metrix', 'Save')}
            </Button>
        </>
    );
}
