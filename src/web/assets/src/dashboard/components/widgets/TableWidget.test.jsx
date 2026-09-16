import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';

vi.mock('@verbb/plugin-kit-react/components/Button', () => ({ Button: ({ variant, ...props }) => <button {...props} /> }));
vi.mock('@verbb/plugin-kit-react/components/Icon', () => ({ Icon: () => null }));
vi.mock('@dashboard/components/widgets/WidgetLarge', () => ({ WidgetLarge: ({ renderContent, widget }) => renderContent(widget.chartData) }));
vi.mock('@utils', () => ({
    cn: (...classes) => classes.join(' '), format: (value) => value, chartFormat: () => '',
    WIDGET_HEIGHT: 12, sort: () => 0, TABLE_ROW_BAR_COLOR: 'blue',
}));

import { TableWidget } from './TableWidget.jsx';

it('exposes table sorting and pagination as named keyboard controls', () => {
    globalThis.React = React;
    globalThis.Craft = { t: (_category, message) => message };
    const widget = {
        data: {},
        chartData: {
            cols: [{ id: 'page', label: 'Page', type: 'string' }, { id: 'visits', label: 'Visits', type: 'integer' }],
            rows: Array.from({ length: 18 }, (_, index) => [`/page-${index}`, index + 1]),
        },
    };
    const html = renderToStaticMarkup(<TableWidget widget={widget} />);

    expect(html).toMatch(/<button[^>]*>[\s\S]*?Page[\s\S]*?<\/button>/);
    expect(html).toContain('aria-label="Previous page"');
    expect(html).toContain('aria-label="Next page"');
});

it('exposes the report as a table with column and row relationships', () => {
    globalThis.React = React;
    globalThis.Craft = { t: (_category, message) => message };
    const html = renderToStaticMarkup(<TableWidget widget={{
        data: { displayTitle: 'Popular pages' },
        chartData: { cols: [{ id: 'page', label: 'Page', type: 'string' }, { id: 'visits', label: 'Visits', type: 'integer' }], rows: [['/home', 42]] },
    }} />);

    expect(html).toContain('role="table"');
    expect(html).toContain('aria-label="Popular pages"');
    expect(html.match(/role="columnheader"/g)).toHaveLength(2);
    expect(html.match(/role="row"/g)).toHaveLength(2);
    expect(html.match(/role="cell"/g)).toHaveLength(2);
});
