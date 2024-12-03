import { forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';

import { Form } from '@components/ui/Form';
import { DynamicField } from '@components/forms/DynamicField';

import { createValidationSchema } from '@utils/validation';

export const DynamicForm = forwardRef(({
    schema,
    data = {},
    onSubmit,
    onFieldChange,
}, ref) => {
    const validationSchema = createValidationSchema(schema);

    const form = useForm({
        resolver: valibotResolver(validationSchema),
        defaultValues: schema.reduce((acc, field) => {
            acc[field.name] = data[field.name] || '';
            return acc;
        }, {}),
    });

    const handleSubmit = (data) => {
        if (onSubmit) {
            onSubmit(data);
        }
    };

    return (
        <Form {...form}>
            <form
                ref={ref}
                onSubmit={form.handleSubmit(handleSubmit)}
                className="mc-space-y-4"
            >
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
