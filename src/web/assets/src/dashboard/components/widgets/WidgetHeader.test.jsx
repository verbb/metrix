import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, expect, it, vi } from 'vitest';

const context = vi.hoisted(() => ({
    canManageViewLayouts: true,
    globalPeriod: 'last7days',
    periodOptions: [],
}));

vi.mock('@verbb/plugin-kit-react/components/Button', () => ({
    Button: ({ children }) => <button>{children}</button>,
}));
vi.mock('@verbb/plugin-kit-react/components/Dialog', () => ({
    Dialog: ({ children }) => <div>{children}</div>,
}));
vi.mock('@verbb/plugin-kit-react/components/DropdownMenu', () => ({
    DropdownItem: ({ children }) => <div>{children}</div>,
    DropdownMenu: ({ children }) => <div>{children}</div>,
    DropdownSeparator: () => <hr />,
}));
vi.mock('@verbb/plugin-kit-react/components/Icon', () => ({
    Icon: () => null,
}));
vi.mock('@components/GroupedPeriodSelect', () => ({
    GroupedPeriodSelect: () => <div>Widget date range</div>,
}));
vi.mock('@components/WidthPicker', () => ({
    WidthPicker: () => <div>Width picker</div>,
}));
vi.mock('@dashboard/hooks/useAppStore', () => ({
    default: (selector) => selector(context),
}));
vi.mock('@dashboard/hooks/useWidgetStore', () => ({
    default: (selector) => selector({
        duplicateWidget: vi.fn(),
        updateWidget: vi.fn(),
        removeWidget: vi.fn(),
        refreshWidgetData: vi.fn(),
    }),
}));
vi.mock('@dashboard/hooks/useWidgetSettingsStore', () => ({
    default: (selector) => selector({
        getSettingsByType: () => [{ name: 'period' }],
    }),
}));
vi.mock('@utils/dashboardPeriod', () => ({
    widgetInheritsDashboardPeriod: () => false,
}));

import { WidgetHeader } from './WidgetHeader.jsx';

const widget = {
    __id: 'widget-1',
    chartData: {},
    data: {
        type: 'counter',
        source: 'analytics',
        metricLabel: 'Visitors',
        period: 'last30days',
        width: 1,
    },
};

beforeEach(() => {
    globalThis.React = React;
    globalThis.Craft = { t: (_category, message) => message };
});

it('keeps refresh available but hides shared layout actions from view-only users', () => {
    context.canManageViewLayouts = false;
    const html = renderToStaticMarkup(<WidgetHeader widget={widget} />);

    expect(html).toContain('Refresh')
        .not.toContain('Settings')
        .not.toContain('Duplicate')
        .not.toContain('Column Size')
        .not.toContain('Delete')
        .not.toContain('Widget date range');
});

it('shows shared layout actions to view layout managers', () => {
    context.canManageViewLayouts = true;
    const html = renderToStaticMarkup(<WidgetHeader widget={widget} />);

    expect(html).toContain('Refresh')
        .toContain('Settings')
        .toContain('Duplicate')
        .toContain('Column Size')
        .toContain('Delete')
        .toContain('Widget date range');
});
