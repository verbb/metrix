import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function parseUTCDate(dateString) {
    return dayjs.utc(dateString);
}

export function parseNaiveDate(dateString) {
    return dayjs(dateString);
}

export function datePeriodDayShortFormat(isoDate) {
    return parseUTCDate(isoDate).format('ha');
}

export function datePeriodDayLongFormat(isoDate) {
    return parseUTCDate(isoDate).format('ddd, D MMM, ha');
}

export function datePeriodWeekShortFormat(isoDate) {
    return parseUTCDate(isoDate).format('ddd');
}

export function datePeriodWeekLongFormat(isoDate) {
    return parseUTCDate(isoDate).format('ddd, D MMM YYYY');
}

export function datePeriodMonthShortFormat(isoDate) {
    return parseUTCDate(isoDate).format('D MMM');
}

export function datePeriodMonthLongFormat(isoDate) {
    return parseUTCDate(isoDate).format('ddd, D MMM YYYY');
}

export function datePeriodYearShortFormat(isoDate) {
    return parseUTCDate(isoDate).format('MMM');
}

export function datePeriodYearLongFormat(isoDate) {
    return parseUTCDate(isoDate).format('MMMM YYYY');
}
