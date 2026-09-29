import { describe, expect, it } from 'vitest';

import { durationFormat } from './duration.js';
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
});
