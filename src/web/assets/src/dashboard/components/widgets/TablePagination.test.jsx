import React from 'react';
import { expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ page: 4, hook: 0, get: vi.fn(), post: vi.fn() }));
vi.mock('react', async(original) => ({
    ...await original(),
    useState: value => state.hook++ === 0
        ? [state.page, value => { state.page = typeof value === 'function' ? value(state.page) : value; }]
        : [value, () => {}],
}));
vi.mock('@verbb/plugin-kit-react/components/Button', () => ({ Button: () => null }));
vi.mock('@verbb/plugin-kit-react/components/Icon', () => ({ Icon: () => null }));
vi.mock('@dashboard/components/widgets/WidgetLarge', () => ({ WidgetLarge: () => null }));
vi.mock('@utils', () => ({
    cn: (...args) => args.join(' '), format: value => value, chartFormat: () => '',
    WIDGET_HEIGHT: 12, sort: () => 0, TABLE_ROW_BAR_COLOR: 'blue',
    api: { get: state.get, post: state.post }, getWidgetFetchFaceMessage: () => 'Fetch failed',
}));

import { TableWidget } from './TableWidget.jsx';

globalThis.React = React;
globalThis.Craft = { t: (_category, message) => message, cp: { displayError: () => {} } };

function nodes(tree) {
    if (!tree || typeof tree !== 'object') return [];
    const children = tree.props?.children;
    return [tree, ...(Array.isArray(children) ? children.flat(Infinity) : [children]).flatMap(nodes)];
}

it('moves back one visible page after a report shrinks from five pages to two', () => {
    state.hook = 0;
    state.page = 4;
    const widget = { data: {}, chartData: {
        cols: [{ id: 'page', label: 'Page', type: 'string' }, { id: 'visits', label: 'Visits', type: 'integer' }],
        rows: Array.from({ length: 10 }, (_, index) => ['/page-' + index, index + 1]),
    } };
    const render = () => {
        state.hook = 0;
        return TableWidget({ widget }).props.renderContent(widget.chartData);
    };
    const before = render();
    const previous = nodes(before).find(node => node.props?.['aria-label'] === 'Previous page');
    const rowsBefore = nodes(before).filter(node => node.props?.role === 'row').map(node => node.key).filter(Boolean);
    previous.props.onClick();
    const rowsAfter = nodes(render()).filter(node => node.props?.role === 'row').map(node => node.key).filter(Boolean);
    expect(rowsBefore).toEqual(['/page-7', '/page-8', '/page-9']);
    expect(rowsAfter).toEqual(Array.from({ length: 7 }, (_, index) => '/page-' + index));
    expect(state.page).toBe(0);
});
