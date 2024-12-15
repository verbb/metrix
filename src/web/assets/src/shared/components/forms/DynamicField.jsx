import React from 'react';

import { Input } from '@components/ui/Input';
import { Checkbox } from '@components/ui/Checkbox';
import { AsyncSelect } from '@components/ui/AsyncSelect';
import { Combobox } from '@components/ui/Combobox';
import { AsyncCombobox } from '@components/ui/AsyncCombobox';

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@components/ui/Select';

import {
    FormField,
    FormItem,
    FormHeader,
    FormLabel,
    FormDescription,
    FormControl,
    FormMessage,
} from '@components/ui/Form';

export const DynamicField = ({ field, form, onFieldChange }) => {
    const { control, setError, clearErrors } = form;

    const renderLabel = () => {
        return (
            <>
                {field.label}
                {field?.validation?.required && (
                    <span className="mc-text-red-500"> *</span>
                )}
            </>
        );
    };

    // Async field: fetch options with error handling
    const handleFetchOptions = async() => {
        try {
            clearErrors(field.name); // Clear any previous errors for this field

            if (field.fetchOptions) {
                return await field.fetchOptions();
            }
        } catch (error) {
            console.error(`Error fetching options for field "${field.name}":`, error);

            setError(field.name, {
                type: 'fetch',
                message: Craft.t('metrix', 'Failed to load options. Please try again.'),
            });

            return []; // Return an empty array to avoid breaking the UI
        }
    };

    if (field.type === 'text') {
        return (
            <FormField
                control={control}
                name={field.name}
                render={({ field: rhfField }) => {
                    return (
                        <FormItem>
                            <FormHeader>
                                <FormLabel>{renderLabel()}</FormLabel>
                                {field.instructions && <FormDescription>{field.instructions}</FormDescription>}
                            </FormHeader>

                            <FormControl>
                                <Input
                                    placeholder={field.placeholder}
                                    {...rhfField}
                                    onChange={(e) => {
                                        rhfField.onChange(e);

                                        if (onFieldChange) {
                                            onFieldChange(e.target.value, field, rhfField);
                                        }
                                    }}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
        );
    }

    if (field.type === 'hidden') {
        return (
            <FormField
                control={control}
                name={field.name}
                render={({ field: rhfField }) => {
                    return (
                        <Input
                            hidden
                            type="hidden"
                            placeholder={field.placeholder}
                            {...rhfField}
                            onChange={(e) => {
                                rhfField.onChange(e);

                                if (onFieldChange) {
                                    onFieldChange(e.target.value, field, rhfField);
                                }
                            }}
                        />
                    );
                }}
            />
        );
    }

    if (field.type === 'select') {
        return (
            <FormField
                control={control}
                name={field.name}
                render={({ field: rhfField }) => {
                    const state = form.getFieldState(field.name);

                    return (
                        <FormItem>
                            <FormHeader>
                                <FormLabel>{renderLabel()}</FormLabel>
                                {field.instructions && <FormDescription>{field.instructions}</FormDescription>}
                            </FormHeader>

                            <FormControl>
                                {field.async ?
                                    <AsyncSelect
                                        fetchOptions={field.fetchOptions}
                                        defaultOptions={field.defaultOptions || []}
                                        value={rhfField.value}
                                        onValueChange={(value) => {
                                            rhfField.onChange(value);

                                            if (onFieldChange) {
                                                onFieldChange(value, field, rhfField);
                                            }
                                        }}
                                        placeholder={field.placeholder}
                                    />
                                    :
                                    <Select
                                        onValueChange={(value) => {
                                            rhfField.onChange(value);

                                            if (onFieldChange) {
                                                onFieldChange(value, field, rhfField);
                                            }
                                        }}
                                        defaultValue={rhfField.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={field.placeholder} />
                                        </SelectTrigger>

                                        <SelectContent className="mc-z-[110]">
                                            {field.options && field.options.map((option) => {
                                                return (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                }
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
        );
    }

    if (field.type === 'combobox') {
        return (
            <FormField
                control={control}
                name={field.name}
                render={({ field: rhfField }) => {
                    const state = form.getFieldState(field.name);

                    return (
                        <FormItem>
                            <FormHeader>
                                <FormLabel>{renderLabel()}</FormLabel>
                                {field.instructions && <FormDescription>{field.instructions}</FormDescription>}
                            </FormHeader>

                            <FormControl>
                                {field.async ?
                                    <AsyncCombobox
                                        form={form}
                                        field={field}
                                        fetchOptions={field.fetchOptions}
                                        defaultOptions={field.defaultOptions || []}
                                        value={rhfField.value}
                                        onValueChange={(value) => {
                                            rhfField.onChange(value);

                                            if (onFieldChange) {
                                                onFieldChange(value, field, rhfField);
                                            }
                                        }}
                                        placeholder={field.placeholder}
                                    />
                                    :
                                    <Combobox />
                                }
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
        );
    }

    if (field.type === 'checkbox') {
        return (
            <FormField
                control={control}
                name={field.name}
                render={({ field: rhfField }) => {
                    return (
                        <FormItem>
                            <FormHeader>
                                <FormLabel>{renderLabel()}</FormLabel>
                                {field.instructions && <FormDescription>{field.instructions}</FormDescription>}
                            </FormHeader>

                            <FormControl>
                                <Checkbox
                                    {...rhfField}
                                    onCheckedChange={(value) => {
                                        rhfField.onChange(value);

                                        if (onFieldChange) {
                                            onFieldChange(value, field, rhfField);
                                        }
                                    }}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
        );
    }
};
