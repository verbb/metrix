import React, { useState, useEffect } from 'react';

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@components/ui/Select';

import LoadingSpinner from '@components/LoadingSpinner';

export const AsyncSelect = ({
    fetchOptions,
    defaultOptions = [],
    value,
    onValueChange,
    placeholder,
}) => {
    const [options, setOptions] = useState(defaultOptions);
    const [loading, setLoading] = useState(!defaultOptions.length);

    useEffect(() => {
        const loadOptions = async() => {
            setLoading(true);

            const fetchedOptions = await fetchOptions();

            setOptions(fetchedOptions);
            setLoading(false);
        };

        loadOptions();
    }, [fetchOptions]);

    return (
        <div className="mc-flex mc-items-center">
            <Select onValueChange={onValueChange} defaultValue={value}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent className="mc-z-[110]">
                    {options.map((option) => {
                        return (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>

            {loading && <LoadingSpinner size="tiny" className="mc-ml-2" />}
        </div>
    );
};
