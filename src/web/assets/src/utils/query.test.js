import { describe, expect, it } from 'vitest';

import { resolveQueryOption } from './query.js';

describe('resolveQueryOption', () => {
    const options = [{ value: 'default' }, { value: 'marketing' }];

    it('keeps a permitted query value', () => {
        expect(resolveQueryOption('marketing', options)).toBe('marketing');
    });

    it('falls back when the query value is missing or unknown', () => {
        expect(resolveQueryOption('removed-view', options)).toBe('default');
        expect(resolveQueryOption(null, options)).toBe('default');
    });
});
