import React from 'react';
import { beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    currentView: 'news',
    collectionGeneration: 1,
    cleanup: null,
    post: vi.fn(),
    addWidget: vi.fn(),
    updateWidgetState: vi.fn(),
    updateWidget: vi.fn(),
    setLoading: vi.fn(),
    setFormErrors: vi.fn(),
}));

vi.mock('react', async(importOriginal) => ({
    ...await importOriginal(),
    useRef: (value) => ({ current: value }),
    useEffect: (effect) => { mocks.cleanup = effect(); },
}));

vi.mock('@components/WidgetSettingsShell', () => ({ WidgetSettingsShell: () => null }));
vi.mock('@dashboard/hooks/useAppStore', () => ({ default: Object.assign((selector) => selector(mocks), { getState: () => mocks }) }));
vi.mock('@dashboard/hooks/useWidgetStore', () => ({ default: Object.assign((selector) => selector(mocks), { getState: () => mocks }) }));
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
    mocks.currentView = 'news';
    mocks.collectionGeneration = 1;
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


it.each(['another view', 'reloaded same view'])('ignores a delayed creation after navigating to %s', async(destination) => {
    let resolve;
    mocks.post.mockReturnValue(new Promise((done) => { resolve = done; }));
    const form = WidgetSettings({ isNew: true });
    const pending = form.props.onSubmit({ type: 'Line', metric: 'pageviews' });
    if (destination === 'another view') mocks.currentView = 'other';
    mocks.collectionGeneration++;
    resolve({ data: { id: 42, type: 'Line', view: 'news' } });
    await pending;
    expect(mocks.addWidget).not.toHaveBeenCalled();
});

it('does not close a newly opened dialog when a dismissed save completes', async() => {
    let resolve;
    mocks.post.mockReturnValue(new Promise((done) => { resolve = done; }));
    const onClose = vi.fn();
    const form = WidgetSettings({ isNew: true, onClose });
    const pending = form.props.onSubmit({ type: 'Line' });
    mocks.cleanup?.();
    resolve({ data: { id: 42, type: 'Line', view: 'news' } });
    await pending;
    expect(mocks.addWidget).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
});
