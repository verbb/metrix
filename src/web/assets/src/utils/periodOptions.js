/**
 * PHP `getGroupedPeriodOptions()` may arrive as a nested array or keyed object.
 */
export function normalizePeriodOptionGroups(periodOptions) {
    if (!periodOptions) {
        return [];
    }

    const groups = Array.isArray(periodOptions)
        ? periodOptions
        : Object.values(periodOptions);

    return groups.filter((group) => Array.isArray(group) && group.length > 0);
}

export function toPeriodOptionValue(value) {
    return value === undefined || value === null ? '' : String(value);
}

export function flattenPeriodOptions(periodOptions) {
    return normalizePeriodOptionGroups(periodOptions).flat();
}
