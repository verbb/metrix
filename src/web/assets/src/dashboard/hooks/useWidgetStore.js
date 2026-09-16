import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { arrayMove } from '@dnd-kit/sortable';

import { api, getWidgetFetchFaceMessage } from '@utils';
import { getWidgetDataParams } from '@utils/dashboardPeriod';
import { zustandHmrFix } from '@utils/store';
import useAppStore from '@dashboard/hooks/useAppStore';

const useWidgetStore = create((set, get) => {
    const reorderQueues = new Map();
    const widgetSaveQueues = new Map();

    return {
        widgets: [],
        collectionGeneration: 0,
        /** Bumped on each dashboard-wide fetch so stale responses cannot overwrite newer period/view state. */
        fetchGeneration: 0,

        loadWidgets: (widgetData) => {
            const widgets = widgetData.map((widget) => {
                return {
                    ...widget,
                    __id: nanoid(),
                    loading: Boolean(widget.data?.id),
                    waitForData: Boolean(widget.data?.id),
                };
            });

            set({ widgets, collectionGeneration: get().collectionGeneration + 1 });

            if (widgets.some((widget) => { return widget.data?.id; })) {
                get().fetchAllWidgetData();
            }
        },

        /**
         * Fetch every widget in parallel so requests overlap and each pane can render
         * as soon as its own response arrives (batch POST was sequential server-side).
         */
        fetchAllWidgetData: async({ refresh = false } = {}) => {
            const widgets = get().widgets.filter((widget) => { return widget.data?.id; });

            if (!widgets.length) {
                return;
            }

            const generation = get().fetchGeneration + 1;
            set({ fetchGeneration: generation });

            await Promise.allSettled(widgets.map((widget) => {
                return get().fetchWidgetData(widget.__id, { refresh });
            }));
        },

        fetchBatchWidgetData: async(refresh = false) => {
            return get().fetchAllWidgetData({ refresh });
        },

        addWidget: (widget) => {
            const newWidget = { ...widget, __id: nanoid() };

            set((state) => {
                return { widgets: [...state.widgets, newWidget] };
            });
        },

        updateWidget: async(widget, updates, fetchData = true) => {
            const current = get().widgets.find((item) => item.__id === widget.__id);

            if (!current) {
                return;
            }

            let queue = widgetSaveQueues.get(current.data.id);

            if (!queue) {
                queue = { promise: Promise.resolve(), requestId: 0, savedData: current.data, fetchData: false };
                widgetSaveQueues.set(current.data.id, queue);
            }

            const requestId = ++queue.requestId;
            queue.fetchData ||= fetchData;
            const isCurrentSave = () => queue.requestId === requestId
                && get().widgets.some((item) => item.__id === current.__id);

            get().updateWidgetState(current, {
                data: { ...current.data, ...updates },
                loading: queue.fetchData,
                error: null,
                ...(queue.fetchData && { waitForData: true, requestId: null }),
            });

            // Serialise writes as well as responses so the latest choice survives reload.
            // Keep confirmed data separately from optimistic edits for failure recovery.
            const pending = queue.promise.then(async() => {
                try {
                    const response = await api.post('save-widget', { id: current.data.id, widget: updates });
                    queue.savedData = { ...queue.savedData, ...response.data };

                    if (!isCurrentSave()) {
                        return;
                    }

                    get().updateWidgetState(current, {
                        data: queue.savedData,
                        loading: false,
                        waitForData: false,
                    });

                    if (queue.fetchData) {
                        get().fetchWidgetData(current.__id);
                    }
                } catch (error) {
                    if (!isCurrentSave()) {
                        return;
                    }

                    console.error('Error updating widget:', error);
                    get().updateWidgetState(current, {
                        data: queue.savedData,
                        loading: false,
                        waitForData: false,
                        error: {
                            message: Craft.t('metrix', 'Failed to update widget. Please try again.'),
                            error,
                        },
                    });
                }
            });
            queue.promise = pending;
            await pending;

            if (queue.promise === pending) {
                widgetSaveQueues.delete(current.data.id);
            }
        },

        removeWidget: async(widget) => {
            // Update client-side state
            get().updateWidgetState(widget, { loading: true, error: null });

            try {
                // Remove server-side widget
                await api.post('delete-widget', { id: widget.data.id });

                // Remove from client-side store
                set((state) => {
                    return {
                        widgets: state.widgets.filter((w) => { return w.__id !== widget.__id; }),
                    };
                });
            } catch (error) {
                console.error('Error deleting widget:', error);

                get().updateWidgetState(widget, {
                    loading: false,
                    error: {
                        message: Craft.t('metrix', 'Failed to delete widget. Please try again.'),
                        error,
                    },
                });
            }
        },

        duplicateWidget: async(originalWidget) => {
            const newWidgetId = nanoid();

            // Add placeholder duplicate widget client-side
            const newWidget = {
                ...originalWidget,
                __id: newWidgetId,
                data: { ...originalWidget.data, id: null }, // Reset server ID
                loading: true,
                waitForData: true, // Prevent fetching until saved
            };

            set((state) => { return { widgets: [...state.widgets, newWidget] }; });

            try {
                // Duplicate on server
                const response = await api.post('duplicate-widget', { id: originalWidget.data.id });

                // Update client-side widget
                get().updateWidgetState(newWidget, {
                    data: { ...newWidget.data, ...response.data },
                    waitForData: false,
                });

                // The duplication endpoint returns widget settings, not chart rows.
                // Resolve the placeholder through the same data lifecycle as every
                // other widget so it cannot remain behind its loading overlay.
                await get().fetchWidgetData(newWidgetId);
            } catch (error) {
                console.error('Error duplicating widget:', error);

                if (!get().widgets.some((widget) => widget.__id === newWidgetId)) {
                    return;
                }

                // No saved identity exists to retry or delete this placeholder.
                set((state) => ({ widgets: state.widgets.filter((widget) => widget.__id !== newWidgetId) }));
                Craft.cp.displayError(Craft.t('metrix', 'Failed to duplicate widget. Please try again.'));
            }
        },

        fetchWidgetData: async(id, { refresh = false } = {}) => {
            const widget = get().widgets.find((w) => { return w.__id === id; });

            if (!widget) {
                console.error(`Widget with id ${id} not found.`);
                return;
            }

            const generation = get().fetchGeneration;
            const requestId = nanoid();
            const isCurrentRequest = () => {
                return get().fetchGeneration === generation
                    && get().widgets.find((current) => current.__id === id)?.requestId === requestId;
            };

            get().updateWidgetState(widget, { requestId, loading: true, waitForData: true, error: null });

            try {
                const payload = getWidgetDataParams(widget, { refresh });

                const response = await api.get('widget-data', payload);

                if (!isCurrentRequest()) {
                    return;
                }

                // Update with fetched data
                get().updateWidgetState(widget, {
                    chartData: response.data, // Store fetched chart data
                    loading: false,
                    waitForData: false,
                });
            } catch (error) {
                if (!isCurrentRequest()) {
                    return;
                }

                get().updateWidgetState(widget, {
                    loading: false,
                    waitForData: false,
                    error: {
                        message: getWidgetFetchFaceMessage(error),
                        error,
                    },
                });
            }
        },

        reorderWidgets: async(sourceWidget, targetWidget) => {
            const { widgets, collectionGeneration } = get();
            const view = useAppStore.getState().currentView;
            const currentIndex = widgets.findIndex((widget) => { return widget.__id === sourceWidget.__id; });
            const newIndex = widgets.findIndex((widget) => { return widget.__id === targetWidget.__id; });

            if (currentIndex === -1 || newIndex === -1) {
                console.error('Widget not found in the current list.');
                return;
            }

            // Create a reordered list
            const reorderedWidgets = arrayMove(widgets, currentIndex, newIndex);

            // Update the local state
            set({ widgets: reorderedWidgets });

            // Persist each view's orders in submission order. A failed later save
            // returns to the last confirmed order, not an earlier optimistic snapshot.
            let queue = reorderQueues.get(view);

            if (!queue) {
                queue = { promise: Promise.resolve(), requestId: 0, savedIds: widgets.map((widget) => widget.data.id) };
                reorderQueues.set(view, queue);
            }

            const requestId = ++queue.requestId;
            const ids = reorderedWidgets.map((widget) => widget.data.id).filter(Boolean);
            const pending = queue.promise.then(async() => {
                try {
                    await api.post('save-widget-order', { ids });
                    queue.savedIds = ids;
                } catch (error) {
                    if (requestId !== queue.requestId || collectionGeneration !== get().collectionGeneration) {
                        return;
                    }

                    console.error('Error saving widget order:', error);
                    const positions = new Map(queue.savedIds.map((id, index) => [id, index]));

                    // Retain refreshed data and newly added/deleted widgets while rolling back order.
                    set((state) => ({ widgets: [...state.widgets].sort((a, b) => {
                        return (positions.get(a.data.id) ?? Infinity) - (positions.get(b.data.id) ?? Infinity);
                    }) }));

                    Craft.cp?.displayError?.(
                        Craft.t('metrix', 'Failed to save widget order. Please try again.'),
                    );
                }
            });
            queue.promise = pending;
            await pending;

            if (queue.promise === pending) {
                reorderQueues.delete(view);
            }
        },

        refreshWidgetData: async(id) => {
            return get().fetchWidgetData(id, { refresh: true });
        },

        updateWidgetState: (widget, updates) => {
            set((state) => {
                const widgets = state.widgets.map((w) => {
                    if (w.__id === widget.__id) {
                        return { ...w, ...updates };
                    }

                    return w;
                });

                return { widgets };
            });
        },

        clearWidgets: () => {
            set({ widgets: [], collectionGeneration: get().collectionGeneration + 1 });
        },
    };
});

// Apply HMR fix to maintain state
zustandHmrFix('widgetStore', useWidgetStore);

export default useWidgetStore;
