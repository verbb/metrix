import { describe, expect, it, vi } from 'vitest';

import { resolveQueryOption, setQueryParam } from './query.js';

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

it('normalizes the initial view without adding a browser history entry', () => {
    const history = { pushState: vi.fn(), replaceState: vi.fn() };
    vi.stubGlobal('window', { location: { pathname: '/index.php', search: '?p=admin%2Fmetrix', hash: '#report' }, history });
    try {
        setQueryParam('view', 'default', { replace: true });
        expect(history.replaceState).toHaveBeenCalledExactlyOnceWith({}, '', '/index.php?p=admin%2Fmetrix&view=default#report');
        expect(history.pushState).not.toHaveBeenCalled();
    } finally {
        vi.unstubAllGlobals();
    }
});
