import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
} from 'react';

import { SchemaFormEngine, useSchemaFormEngine } from '@verbb/plugin-kit-react/forms';

import { getErrorMessage } from '@utils';
import {
    buildWidgetSettingsDefaultValues,
    buildWidgetSettingsSchemaIndex,
    getWidgetSettingsSchemaKey,
} from '@utils/widgetSettingsSchema';

const WidgetSettingsFormEngine = forwardRef(({
    rawSchema,
    data,
    errors,
    onSubmit,
    onValuesChange,
}, ref) => {
    const schemaIndex = useMemo(() => {
        return buildWidgetSettingsSchemaIndex(rawSchema);
    }, [rawSchema]);

    const defaultValues = useMemo(() => {
        return buildWidgetSettingsDefaultValues(rawSchema, data);
    }, [rawSchema, data]);

    const form = useSchemaFormEngine({
        schemaIndex,
        defaultValues,
        errors,
        onChange: onValuesChange,
    });

    useImperativeHandle(ref, () => ({
        handleSubmit: () => form.handleSubmit(),
    }), [form]);

    useEffect(() => {
        form.onSubmit(onSubmit);
    }, [form, onSubmit]);

    const generalError = errors?.general;
    const errorDetail = generalError ? getErrorMessage(generalError) : null;

    return (
        <div className="metrix-widget-settings-form">
            {errors?.general && errorDetail && (
                <div className="text-error text-sm mb-4" role="alert">
                    <strong className="block mb-1">{errorDetail.heading}</strong>
                    <small className="block mb-1">{errorDetail.text}</small>

                    <small className="block font-mono text-[9px] whitespace-nowrap overflow-auto">
                        {errorDetail.traceAsArray.map((str) => (
                            <span key={str} className="block">{str}</span>
                        ))}
                    </small>
                </div>
            )}

            <SchemaFormEngine
                form={form}
                withoutForm
                className="space-y-4"
            />
        </div>
    );
});

WidgetSettingsFormEngine.displayName = 'WidgetSettingsFormEngine';

export const WidgetSettingsForm = forwardRef((props, ref) => {
    const schemaKey = getWidgetSettingsSchemaKey(props.rawSchema);
    // Remount when chart type changes so field values/schema stay in sync.
    const formKey = `${schemaKey}:${props.data?.type ?? ''}`;

    return (
        <WidgetSettingsFormEngine
            key={formKey}
            ref={ref}
            {...props}
        />
    );
});

WidgetSettingsForm.displayName = 'WidgetSettingsForm';
