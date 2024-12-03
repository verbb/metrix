export function sortStrings(valueA, valueB, direction = 'asc') {
    const strA = String(valueA || '').toLowerCase();
    const strB = String(valueB || '').toLowerCase();

    // Handle special cases: move "(not set)" to the end
    if (strA === '(not set)') {
        return direction === 'asc' ? 1 : -1;
    }

    if (strB === '(not set)') {
        return direction === 'asc' ? -1 : 1;
    }

    // Standard localeCompare for other strings
    const result = strA.localeCompare(strB);

    return direction === 'asc' ? result : -result;
}
