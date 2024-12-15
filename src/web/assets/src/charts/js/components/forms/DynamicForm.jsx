import { forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';

import { Form } from '@components/ui/Form';
import { DynamicField } from '@components/forms/DynamicField';

import { getErrorMessage } from '@utils';
import { createValidationSchema } from '@utils/validation';

export const DynamicForm = forwardRef(({
    schema,
    data = {},
    onSubmit,
    onFieldChange,
    errors = {},
}, ref) => {
    const validationSchema = createValidationSchema(schema);

    const form = useForm({
        resolver: valibotResolver(validationSchema),
        defaultValues: schema.reduce((acc, field) => {
            acc[field.name] = data[field.name] || '';
            return acc;
        }, {}),
    });

    useEffect(() => {
        // Set server-side errors on fields
        if (errors && typeof errors === 'object') {
            Object.entries(errors).forEach(([fieldName, message]) => {
                form.setError(fieldName, { message });
            });
        }
    }, [errors, form]);

    const handleSubmit = (data) => {
        if (onSubmit) {
            onSubmit(data);
        }
    };

    const errorDetail = getErrorMessage(errors?.general);

    return (
        <Form {...form}>
            <form
                ref={ref}
                onSubmit={form.handleSubmit(handleSubmit)}
                className="mc-space-y-4"
            >
                {errors?.general && errorDetail && (
                    <div className="mc-text-red-500 mc-text-sm mc-mb-4">
                        <strong className="mc-block mc-mb-1">{errorDetail.heading}</strong>
                        <small className="mc-block mc-mb-1">{errorDetail.text}</small>

                        <small className="mc-block mc-font-mono mc-text-[9px] mc-whitespace-nowrap mc-overflow-auto">
                            {errorDetail.trace.map((str) => {
                                return <span key={str} className="mc-block">{str}</span>;
                            })}
                        </small>
                    </div>
                )}

                {schema.map((field) => {
                    return (
                        <DynamicField key={field.name} field={field} form={form} onFieldChange={onFieldChange} />
                    );
                })}
            </form>
        </Form>
    );
});

DynamicForm.displayName = 'DynamicForm';
