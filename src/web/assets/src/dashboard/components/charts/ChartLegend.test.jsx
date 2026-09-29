import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';

vi.mock('@verbb/plugin-kit-react/components/Button', () => ({ Button: ({ variant, ...props }) => <button {...props} /> }));
vi.mock('@verbb/plugin-kit-react/components/Icon', () => ({ Icon: () => null }));
vi.mock('@utils', () => ({ cn: (...classes) => classes.join(' ') }));

import { ChartLegend } from './ChartLegend.jsx';

it('makes chart legend visibility available to keyboard users', () => {
    globalThis.React = React;
    globalThis.Craft = { t: (_category, message) => message };
    const html = renderToStaticMarkup(<ChartLegend chartRef={{ current: null }} legendItems={[
        { text: 'Desktop', fillStyle: 'blue', hidden: false },
        { text: 'Mobile', fillStyle: 'red', hidden: true },
    ]} />);

    expect(html).toMatch(/<button[^>]*aria-pressed="true"[^>]*>[\s\S]*?Desktop[\s\S]*?<\/button>/);
    expect(html).toMatch(/<button[^>]*aria-pressed="false"[^>]*>[\s\S]*?Mobile[\s\S]*?<\/button>/);
});
