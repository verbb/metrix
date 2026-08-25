import { Fragment, useMemo } from 'react';

import {
    Option,
    Select,
    Separator,
} from '@verbb/plugin-kit-react/components';

import { normalizePeriodOptionGroups, toPeriodOptionValue } from '@utils/periodOptions';

/**
 * Period picker with horizontal separators between PHP period groups
 * (Today/Yesterday · week presets · month presets · etc.).
 */
export function GroupedPeriodSelect({
    periodOptions,
    value,
    onChange,
    className,
    size,
    placeholder,
    clearable = false,
}) {
    const groups = useMemo(() => normalizePeriodOptionGroups(periodOptions), [periodOptions]);

    const handleChange = (event) => {
        const raw = event.detail?.value;

        if (raw === undefined || raw === null || raw === '') {
            onChange(null);
            return;
        }

        const match = groups
            .flat()
            .find((option) => toPeriodOptionValue(option.value) === toPeriodOptionValue(raw));

        if (match) {
            onChange(match.value);
        }
    };

    if (groups.length === 0) {
        return null;
    }

    return (
        <Select
            className={className}
            value={value ? toPeriodOptionValue(value) : ''}
            placeholder={placeholder}
            clearable={clearable}
            size={size}
            onPkChange={handleChange}
            onPkClear={() => onChange(null)}
        >
            {groups.map((group, groupIndex) => (
                <Fragment key={`period-group-${groupIndex}`}>
                    {groupIndex > 0 ? <Separator /> : null}

                    {group.map((option) => (
                        <Option
                            key={toPeriodOptionValue(option.value)}
                            value={toPeriodOptionValue(option.value)}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </Option>
                    ))}
                </Fragment>
            ))}
        </Select>
    );
}
