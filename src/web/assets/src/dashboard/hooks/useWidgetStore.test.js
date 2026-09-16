import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getMock, postMock } = vi.hoisted(() => ({
    getMock: vi.fn(),
    postMock: vi.fn(),
}));

vi.mock('@utils', () => ({
    api: {
        get: getMock,
        post: postMock,
    },
    getWidgetFetchFaceMessage: () => 'Unable to fetch widget data.',
}));

import useWidgetStore from './useWidgetStore.js';
import useAppStore from './useAppStore.js';

describe('useWidgetStore duplicate lifecycle', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        getMock.mockReset();
        postMock.mockReset();
        useWidgetStore.setState({ widgets: [], fetchGeneration: 0 });
        globalThis.Craft = {
            t: (_category, message) => message,
            cp: { displayError: vi.fn() },
        };
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('fetches chart data and clears loading after duplicating a widget', async() => {
        const original = {
            __id: 'original',
            component: 'Chart',
            data: { id: 10, type: 'line', title: 'Revenue' },
            chartData: { labels: ['old'] },
            loading: false,
            waitForData: false,
        };
        useWidgetStore.setState({ widgets: [original] });
        postMock.mockResolvedValue({ data: { id: 11, title: 'Revenue copy' } });
        getMock.mockResolvedValue({ data: { labels: ['new'], datasets: [] } });

        await useWidgetStore.getState().duplicateWidget(original);

        expect(postMock).toHaveBeenCalledWith('duplicate-widget', { id: 10 });
        expect(getMock).toHaveBeenCalledWith('widget-data', { id: 11 });

        const duplicate = useWidgetStore.getState().widgets[1];
        expect(duplicate.data.id).toBe(11);
        expect(duplicate.chartData.labels).toEqual(['new']);
        expect(duplicate.loading).toBe(false);
        expect(duplicate.waitForData).toBe(false);
    });

    it('rolls back an optimistic widget edit when saving fails', async() => {
        const original = {
            __id: 'original',
            data: { id: 10, width: 1 },
            loading: false,
        };
        useWidgetStore.setState({ widgets: [original] });
        postMock.mockRejectedValue(new Error('offline'));

        await useWidgetStore.getState().updateWidget(original, { width: 2 }, false);

        const widget = useWidgetStore.getState().widgets[0];
        expect(widget.data.width).toBe(1);
        expect(widget.loading).toBe(false);
        expect(widget.error.message).toBe('Failed to update widget. Please try again.');
    });

    it.each([[true, true], [true, false], [false, true], [false, false]])(
        'persists overlapping edits in order and rolls back to confirmed data (%s, %s)',
        async(firstSucceeds, secondSucceeds) => {
            const original = { __id: 'original', data: { id: 10, width: 1 } };
            useWidgetStore.setState({ widgets: [original] });
            let finishFirst;
            let persistedWidth = 1;
            postMock.mockImplementationOnce(() => new Promise((resolve, reject) => {
                finishFirst = () => {
                    if (firstSucceeds) {
                        persistedWidth = 2;
                        resolve({ data: { id: 10, width: persistedWidth } });
                    } else {
                        reject(new Error('first failed'));
                    }
                };
            }));
            postMock.mockImplementationOnce(async() => {
                if (!secondSucceeds) {
                    throw new Error('second failed');
                }
                persistedWidth = 3;
                return { data: { id: 10, width: persistedWidth } };
            });
            const older = useWidgetStore.getState().updateWidget(original, { width: 2 }, false);
            await Promise.resolve();
            const newer = useWidgetStore.getState().updateWidget(original, { width: 3 }, false);
            await Promise.resolve();
            const simultaneous = postMock.mock.calls.length;
            finishFirst();
            await Promise.all([older, newer]);

            const expected = secondSucceeds ? 3 : (firstSucceeds ? 2 : 1);
            expect(simultaneous).toBe(1);
            expect(persistedWidth).toBe(expected);
            expect(useWidgetStore.getState().widgets[0].data.width).toBe(expected);
            expect(useWidgetStore.getState().widgets[0].waitForData).toBe(false);
        },
    );

    it('still fetches a changed period when a width edit follows it', async() => {
        const original = { __id: 'original', data: { id: 10, width: 1, period: 'old' } };
        useWidgetStore.setState({ widgets: [original] });
        let finish;
        postMock.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
        postMock.mockResolvedValueOnce({ data: { id: 10, width: 3, period: 'new' } });
        getMock.mockResolvedValue({ data: { total: 42 } });
        const older = useWidgetStore.getState().updateWidget(original, { period: 'new' });
        await Promise.resolve();
        const newer = useWidgetStore.getState().updateWidget(original, { width: 3 }, false);
        finish({ data: { id: 10, width: 1, period: 'new' } });
        await Promise.all([older, newer]);
        await Promise.resolve();

        const current = useWidgetStore.getState().widgets[0];
        expect(current.data).toMatchObject({ width: 3, period: 'new' });
        expect(current.chartData).toEqual({ total: 42 });
        expect(current.waitForData).toBe(false);
    });

    it('restores widget order when persistence fails', async() => {
        const first = { __id: 'first', data: { id: 10 } };
        const second = { __id: 'second', data: { id: 11 } };
        useWidgetStore.setState({ widgets: [first, second] });
        postMock.mockRejectedValue(new Error('offline'));

        await useWidgetStore.getState().reorderWidgets(first, second);

        expect(useWidgetStore.getState().widgets.map((widget) => widget.__id)).toEqual(['first', 'second']);
        expect(Craft.cp.displayError).toHaveBeenCalledWith('Failed to save widget order. Please try again.');
    });

    it('does not restore an old view after its reorder fails', async() => {
        const first = { __id: 'first', data: { id: 10 } };
        const second = { __id: 'second', data: { id: 11 } };
        useWidgetStore.setState({ widgets: [first, second] });
        useAppStore.setState({ currentView: 'old' });
        let reject;
        postMock.mockImplementationOnce(() => new Promise((_resolve, fail) => { reject = fail; }));
        const pending = useWidgetStore.getState().reorderWidgets(first, second);
        await Promise.resolve();
        useAppStore.setState({ currentView: 'new' });
        useWidgetStore.getState().clearWidgets();
        const current = { __id: 'current', data: { title: 'New view' } };
        useWidgetStore.getState().addWidget(current);
        reject(new Error('offline'));
        await pending;

        expect(useWidgetStore.getState().widgets.map((widget) => widget.data.title)).toEqual(['New view']);
        expect(Craft.cp.displayError).not.toHaveBeenCalled();
    });

    it('preserves fresh widget data while restoring a failed order', async() => {
        const first = { __id: 'first', data: { id: 10 } };
        const second = { __id: 'second', data: { id: 11 } };
        useWidgetStore.setState({ widgets: [first, second] });
        let reject;
        postMock.mockImplementationOnce(() => new Promise((_resolve, fail) => { reject = fail; }));
        const pending = useWidgetStore.getState().reorderWidgets(first, second);
        await Promise.resolve();
        useWidgetStore.getState().updateWidgetState(first, { chartData: { total: 42 } });
        reject(new Error('offline'));
        await pending;

        expect(useWidgetStore.getState().widgets.map((widget) => widget.__id)).toEqual(['first', 'second']);
        expect(useWidgetStore.getState().widgets[0].chartData.total).toBe(42);
    });

    it('serializes overlapping orders and restores the last saved order on failure', async() => {
        const first = { __id: 'first', data: { id: 10 } };
        const second = { __id: 'second', data: { id: 11 } };
        useWidgetStore.setState({ widgets: [first, second] });
        let finish;
        postMock.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
        postMock.mockRejectedValueOnce(new Error('offline'));
        const older = useWidgetStore.getState().reorderWidgets(first, second);
        await Promise.resolve();
        const newer = useWidgetStore.getState().reorderWidgets(second, first);
        await Promise.resolve();
        const simultaneous = postMock.mock.calls.length;
        finish({});
        await Promise.all([older, newer]);

        expect(simultaneous).toBe(1);
        expect(postMock.mock.calls.map((call) => call[1].ids)).toEqual([[11, 10], [10, 11]]);
        expect(useWidgetStore.getState().widgets.map((widget) => widget.__id)).toEqual(['second', 'first']);
    });

    it.each([false, true])('keeps the newest widget response when an older request finishes last (dashboard: %s)', async(dashboard) => {
        const widget = { __id: 'first', data: { id: 10 } };
        useWidgetStore.setState({ widgets: [widget] });
        let resolveOld;
        getMock.mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve; }));
        getMock.mockResolvedValueOnce({ data: { total: 25 } });

        const oldRequest = dashboard
            ? useWidgetStore.getState().fetchAllWidgetData()
            : useWidgetStore.getState().fetchWidgetData('first');
        await useWidgetStore.getState().refreshWidgetData('first');
        resolveOld({ data: { total: 10 } });
        await oldRequest;

        expect(useWidgetStore.getState().widgets[0].chartData.total).toBe(25);
        expect(useWidgetStore.getState().widgets[0].waitForData).toBe(false);
    });
});
