import * as number from './number';
import * as percentage from './percentage';
import * as money from './money';
import * as duration from './duration';
import * as date from './date';

const formatters = {
    numberShort: number.numberShortFormat,
    numberLong: number.numberLongFormat,
    percentage: percentage.percentageFormat,
    percentageChange: percentage.percentageChangeFormat,
    duration: duration.durationFormat,
    moneyShort: money.moneyShortFormat,
    moneyLong: money.moneyLongFormat,
    datePeriodDayShort: date.datePeriodDayShortFormat,
    datePeriodDayLong: date.datePeriodDayLongFormat,
    datePeriodWeekShort: date.datePeriodWeekShortFormat,
    datePeriodWeekLong: date.datePeriodWeekLongFormat,
    datePeriodMonthShort: date.datePeriodMonthShortFormat,
    datePeriodMonthLong: date.datePeriodMonthLongFormat,
    datePeriodYearShort: date.datePeriodYearShortFormat,
    datePeriodYearLong: date.datePeriodYearLongFormat,
};

export function format(value, type) {
    if (!type) {
        return;
    }

    const formatter = formatters[type];

    if (typeof formatter === 'function') {
        return formatter(value);
    }

    if (type === 'string') {
        return value;
    }

    console.warn(`No formatter found for type: ${type}`);

    return value;
}

export function chartFormat(column, context) {
    if (!column || !column.type) {
        throw new Error('Invalid column data provided.');
    }

    switch (context) {
        case 'tooltip':
            return column.tooltipFormat || column.labelFormat || column.type;
        case 'label':
            return column.labelFormat || column.type;
        default:
            return column.type;
    }
}
