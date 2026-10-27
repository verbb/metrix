import { describe, expect, it } from 'vitest';

import { durationFormat } from './duration.js';
import { moneyLongFormat, moneyShortFormat } from './money.js';
import { numberLongFormat, numberShortFormat } from './number.js';

describe('dashboard value formatting', () => {
    it('formats duration boundaries without dropping hours or zero-padding seconds', () => {
        expect(durationFormat(59)).toBe('59s');
        expect(durationFormat(61)).toBe('1m 01s');
        expect(durationFormat(3661)).toBe('1h 1m 1s');
    });

    it('uses stable abbreviated and long number formats', () => {
        expect(numberShortFormat(1_250)).toBe('1.2k');
        expect(numberShortFormat(125_000_000)).toBe('125M');
        expect(numberLongFormat(1_234_567)).toBe('1,234,567');
    });

    it('formats numeric money values in abbreviated form, including zero', () => {
        expect(moneyShortFormat(1_250)).toBe('1.2k');
        expect(moneyShortFormat(0)).toBe('0');
    });

    it('formats numeric money values in long form, including zero', () => {
        expect(moneyLongFormat(1_234_567)).toBe('1,234,567');
        expect(moneyLongFormat(0)).toBe('0');
    });

    it('preserves preformatted money values from providers', () => {
        const value = { short: '$1.2k', long: '$1,250.00' };

        expect(moneyShortFormat(value)).toBe('$1.2k');
        expect(moneyLongFormat(value)).toBe('$1,250.00');
    });

    it('uses a placeholder for missing money values', () => {
        expect(moneyShortFormat(null)).toBe('-');
        expect(moneyLongFormat(undefined)).toBe('-');
    });
});
