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

    it('restores widget order when persistence fails', async() => {
        const first = { __id: 'first', data: { id: 10 } };
        const second = { __id: 'second', data: { id: 11 } };
        useWidgetStore.setState({ widgets: [first, second] });
        postMock.mockRejectedValue(new Error('offline'));

        await useWidgetStore.getState().reorderWidgets(first, second);

        expect(useWidgetStore.getState().widgets.map((widget) => widget.__id)).toEqual(['first', 'second']);
        expect(Craft.cp.displayError).toHaveBeenCalledWith('Failed to save widget order. Please try again.');
    });
});
