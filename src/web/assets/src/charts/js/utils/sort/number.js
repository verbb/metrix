export function sortNumbers(valueA, valueB, direction = 'asc') {
    const numA = parseFloat(valueA) || 0;
    const numB = parseFloat(valueB) || 0;
    const result = numA - numB;

    return direction === 'asc' ? result : -result;
}
