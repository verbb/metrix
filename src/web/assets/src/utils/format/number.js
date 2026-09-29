const THOUSAND = 1000;
const HUNDRED_THOUSAND = 100000;
const MILLION = 1000000;
const HUNDRED_MILLION = 100000000;
const BILLION = 1000000000;
const HUNDRED_BILLION = 100000000000;
const TRILLION = 1000000000000;

const numberFormat = Intl.NumberFormat('en-US');

export function numberShortFormat(num) {
    if (num >= THOUSAND && num < MILLION) {
        const thousands = num / THOUSAND;

        if (thousands === Math.floor(thousands) || num >= HUNDRED_THOUSAND) {
            return `${Math.floor(thousands)}k`;
        }

        return `${Math.floor(thousands * 10) / 10}k`;
    }

    if (num >= MILLION && num < BILLION) {
        const millions = num / MILLION;

        if (millions === Math.floor(millions) || num >= HUNDRED_MILLION) {
            return `${Math.floor(millions)}M`;
        }

        return `${Math.floor(millions * 10) / 10}M`;
    }

    if (num >= BILLION && num < TRILLION) {
        const billions = num / BILLION;

        if (billions === Math.floor(billions) || num >= HUNDRED_BILLION) {
            return `${Math.floor(billions)}B`;
        }

        return `${Math.floor(billions * 10) / 10}B`;
    }

    return num.toString();
}

export function numberLongFormat(num) {
    return numberFormat.format(num);
}
