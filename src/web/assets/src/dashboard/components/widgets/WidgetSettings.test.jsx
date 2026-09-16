import React from 'react';
import { beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    post: vi.fn(),
    addWidget: vi.fn(),
    updateWidgetState: vi.fn(),
    updateWidget: vi.fn(),
    setLoading: vi.fn(),
    setFormErrors: vi.fn(),
}));

vi.mock('@components/WidgetSettingsShell', () => ({ WidgetSettingsShell: () => null }));
vi.mock('@dashboard/hooks/useAppStore', () => ({ default: (selector) => selector({ currentView: 'news' }) }));
vi.mock('@dashboard/hooks/useWidgetStore', () => ({ default: (selector) => selector(mocks) }));
vi.mock('@hooks/useWidgetSettingsForm', () => ({
    useWidgetSettingsForm: () => ({
        mergeFormData: (data) => data,
        setLoading: mocks.setLoading,
        setFormErrors: mocks.setFormErrors,
    }),
}));
vi.mock('@utils', () => ({ api: { post: mocks.post } }));
vi.mock('@utils/widgets', () => ({ preloadWidget: (data) => ({ component: data.type, data }) }));

import { WidgetSettings } from './WidgetSettings.jsx';

beforeEach(() => {
    vi.clearAllMocks();
    globalThis.React = React;
});

it('creates a widget without an existing widget data object', async() => {
    const data = { id: 12, type: 'Line', metric: 'pageviews' };
    const onClose = vi.fn();
    mocks.post.mockResolvedValue({ data });
    const form = WidgetSettings({ isNew: true, onClose });

    await form.props.onSubmit({ type: 'Line', metric: 'pageviews' });

    expect(mocks.post).toHaveBeenCalledTimes(1);
    expect(mocks.addWidget).toHaveBeenCalledWith({ component: 'Line', data });
    expect(onClose).toHaveBeenCalledOnce();
    expect(mocks.setLoading).toHaveBeenLastCalledWith(false);
});

it('applies saved settings locally and invalidates chart data without another save', async() => {
    const widget = { __id: 'existing', data: { id: 12, type: 'Line', metric: 'pageviews' } };
    const data = { ...widget.data, metric: 'visitors' };
    mocks.post.mockResolvedValue({ data });
    const form = WidgetSettings({ widget });

    await form.props.onSubmit(data);

    expect(mocks.post).toHaveBeenCalledTimes(1);
    expect(mocks.updateWidget).not.toHaveBeenCalled();
    expect(mocks.updateWidgetState).toHaveBeenCalledWith(widget, expect.objectContaining({
        data,
        component: 'Line',
        chartData: null,
        waitForData: false,
    }));
});
