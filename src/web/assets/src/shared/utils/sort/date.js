export function sortDates(valueA, valueB, direction = 'asc') {
    const dateA = new Date(valueA).getTime() || 0;
    const dateB = new Date(valueB).getTime() || 0;
    const result = dateA - dateB;

    return direction === 'asc' ? result : -result;
}
