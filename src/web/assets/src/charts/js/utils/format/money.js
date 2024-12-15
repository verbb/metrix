export function moneyShortFormat(value) {
    if (typeof value == 'number') {
        return numberShortFormat(value);
    }

    if (value) {
        return value.short;
    }

    return '-';
}

export function moneyLongFormat(value) {
    if (typeof value == 'number') {
        return numberLongFormat(value);
    }

    if (value) {
        return value.long;
    }

    return '-';
}
