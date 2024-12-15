export function percentageFormat(number) {
    if (typeof (number) === 'number') {
        return `${number}%`;
    }

    return '-';
}

export function percentageChangeFormat(number) {
    if (typeof (number) === 'number') {
        return number > 0 ? `+${number}%` : `${number}%`;
    }

    return '-';
}
