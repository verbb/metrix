import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';

vi.mock('@utils', () => ({ cn: (...values) => values.flat().filter(Boolean).join(' ') }));

import { WidthPicker } from './WidthPicker.jsx';

it('exposes named native width buttons and the selected width', () => {
    globalThis.React = React;
    globalThis.Craft = { t: (_category, text, values = {}) => text.replace('{num}', values.num) };
    const html = renderToStaticMarkup(<WidthPicker value="2" onChange={() => {}} />);

    expect(html.match(/<button /g)).toHaveLength(3);
    expect(html).toContain('aria-label="Column 1"');
    expect(html).toContain('aria-label="Column 2" aria-pressed="true"');
    expect(html).toContain('aria-label="Column 3"');
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
});
