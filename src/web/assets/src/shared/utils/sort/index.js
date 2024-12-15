import * as number from './number';
import * as string from './string';

const sorters = {
    integer: number.sortNumbers,
    float: number.sortNumbers,
    string: string.sortStrings,
};

export function sort(values, type, direction = 'asc') {
    if (!type) {
        return;
    }

    const sorter = sorters[type];

    if (typeof sorter === 'function') {
        return sorter(values[0], values[1], direction);
    }

    console.warn(`No sorter found for type: ${type}`);

    return 0; // Default: no sorting
}
