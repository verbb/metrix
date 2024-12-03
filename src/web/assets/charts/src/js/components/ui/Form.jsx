import {
    createContext, useContext, forwardRef, useId,
} from 'react';

import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';

import { Label } from '@components/ui/Label';

import { cn } from '@utils';

const Form = FormProvider;

const FormFieldContext = createContext({});

const FormField = ({ ...props }) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
};

const FormItemContext = createContext({});

const useFormField = () => {
    const fieldContext = useContext(FormFieldContext);
    const itemContext = useContext(FormItemContext);
    const { getFieldState, formState } = useFormContext();

    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>');
    }

    const fieldState = getFieldState(fieldContext.name, formState);
    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
};

const FormItem = forwardRef(({ className, ...props }, ref) => {
    const id = useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div
                ref={ref}
                className={cn(
                    // Reset
                    'mc-space-y-1',

                    // Custom Classes
                    className,
                )}
                {...props}
            />
        </FormItemContext.Provider>
    );
});
FormItem.displayName = 'FormItem';

const FormHeader = forwardRef(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                className,
            )}
            {...props}
        />
    );
});
FormHeader.displayName = 'FormHeader';

const FormLabel = forwardRef(({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField();

    return (
        <Label
            ref={ref}
            className={cn(
                // Reset
                'mc-text-base',

                // Themes
                'mc-font-bold mc-text-sm mc-text-slate-500',

                // Custom Classes
                className,
            )}
            htmlFor={formItemId}
            {...props}
        />
    );
});
FormLabel.displayName = 'FormLabel';

const FormControl = forwardRef(({ ...props }, ref) => {
    const {
        error, formItemId, formDescriptionId, formMessageId,
    } = useFormField();

    return (
        <Slot
            ref={ref}
            id={formItemId}
            aria-describedby={
                !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
            }
            aria-invalid={!!error}
            {...props}
        />
    );
});
FormControl.displayName = 'FormControl';

const FormDescription = forwardRef(({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return (
        <p
            ref={ref}
            id={formDescriptionId}
            className={cn(
                // Reset
                'mc-text-sm',

                // Themes
                'mc-text-slate-500',

                // Custom Classes
                className,
            )}
            {...props}
        />
    );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = forwardRef(({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
        return null;
    }

    return (
        <p
            ref={ref}
            id={formMessageId}
            className={cn(
                'mc-text-sm mc-text-red-600',

                // Custom Classes
                className,
            )}
            {...props}
        >
            {body}
        </p>
    );
});
FormMessage.displayName = 'FormMessage';

export {
    useFormField,
    Form,
    FormItem,
    FormHeader,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
};
