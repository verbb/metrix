import React from 'react';
import { expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ effects: [], fetch: vi.fn() }));
vi.mock('react', async(original) => ({ ...await original(), useEffect: effect => { mocks.effects.push(effect); } }));
vi.mock('@components/FadeIn', () => ({ FadeIn: () => null }));
vi.mock('@dashboard/components/widgets/WidgetHeader', () => ({ WidgetHeader: () => null }));
vi.mock('@dashboard/components/widgets/WidgetLoading', () => ({ WidgetLoading: () => null }));
vi.mock('@dashboard/components/widgets/WidgetError', () => ({ WidgetError: () => null }));
vi.mock('@dashboard/components/widgets/WidgetEmpty', () => ({ WidgetEmpty: () => null }));
vi.mock('@dashboard/hooks/useAppStore', () => ({ default: () => ({ realtimeInterval: 1000 }) }));
vi.mock('@dashboard/hooks/useWidgetStore', () => ({ default: () => ({ fetchWidgetData: mocks.fetch }) }));
vi.mock('@utils', () => ({ cn: (...classes) => classes.join(' ') }));

import { Widget } from './Widget.jsx';

it('lets a slow realtime request finish before scheduling another poll', () => {
    globalThis.React = React;
    vi.useFakeTimers();
    mocks.effects = [];
    mocks.fetch.mockReset().mockResolvedValue({});
    try {
        Widget({ widget: { __id: 'slow', data: { id: 1, type: 'verbb\\metrix\\widgets\\Realtime' }, waitForData: true, loading: true }, renderContent: () => null });
        const cleanupPending = mocks.effects[1]();
        vi.advanceTimersByTime(5000);
        expect(mocks.fetch).not.toHaveBeenCalled();
        cleanupPending?.();

        mocks.effects = [];
        Widget({ widget: { __id: 'slow', data: { id: 1, type: 'verbb\\metrix\\widgets\\Realtime' }, waitForData: false, chartData: { rows: [[12]] } }, renderContent: () => null });
        const cleanupReady = mocks.effects[1]();
        vi.advanceTimersByTime(1000);
        expect(mocks.fetch).toHaveBeenCalledExactlyOnceWith('slow');
        cleanupReady?.();
        vi.advanceTimersByTime(5000);
        expect(mocks.fetch).toHaveBeenCalledTimes(1);
    } finally {
        vi.useRealTimers();
    }
});
