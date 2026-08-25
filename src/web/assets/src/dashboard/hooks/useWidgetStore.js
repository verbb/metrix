import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { arrayMove } from '@dnd-kit/sortable';

import { api, getWidgetFetchFaceMessage } from '@utils';
import { getWidgetDataParams } from '@utils/dashboardPeriod';
import { zustandHmrFix } from '@utils/store';
import useAppStore from '@dashboard/hooks/useAppStore';

const useWidgetStore = create((set, get) => {
    return {
        widgets: [],

        loadWidgets: (widgetData) => {
            const widgets = widgetData.map((widget) => {
                return {
                    ...widget,
                    __id: nanoid(),
                    loading: Boolean(widget.data?.id),
                    waitForData: Boolean(widget.data?.id),
                };
            });

            set({ widgets });

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

            set((state) => {
                return {
                    widgets: state.widgets.map((widget) => {
                        if (!widget.data?.id) {
                            return widget;
                        }

                        return {
                            ...widget,
                            loading: true,
                            error: null,
                            waitForData: true,
                        };
                    }),
                };
            });

            await Promise.allSettled(widgets.map(async(widget) => {
                try {
                    const payload = getWidgetDataParams(widget, { refresh });
                    const response = await api.get('widget-data', payload);

                    get().updateWidgetState(widget, {
                        chartData: response.data,
                        loading: false,
                        waitForData: false,
                        error: null,
                    });
                } catch (error) {
                    // Reconnect messages are face-worthy; other API dumps stay in Details.
                    get().updateWidgetState(widget, {
                        loading: false,
                        waitForData: false,
                        error: {
                            message: getWidgetFetchFaceMessage(error),
                            error,
                        },
                    });
                }
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
            // Merge updates into the current widget data
            const updatedData = { ...widget.data, ...updates };

            // Update client-side state with conditional loading and error reset
            get().updateWidgetState(widget, {
                data: updatedData,
                loading: fetchData, // Show loading only if fetching is needed
                error: null,
                ...(fetchData && { waitForData: true }), // Add `waitForData` only if fetching is needed
            });

            try {
                // Send only the updated data to the server
                const response = await api.post('save-widget', { id: widget.data.id, widget: updates });

                // Update the client-side state with the server's response
                get().updateWidgetState(widget, {
                    data: { ...updatedData, ...response.data }, // Merge server response into the data
                    loading: false,
                    ...(fetchData && { waitForData: false }), // Maintain `waitForData` if fetching is needed
                });

                // If fetching data after update, trigger fetch
                if (fetchData) {
                    get().fetchWidgetData(widget.__id);
                }
            } catch (error) {
                console.error('Error updating widget:', error);

                // Update client-side state to reflect the error
                get().updateWidgetState(widget, {
                    loading: false,
                    error: {
                        message: Craft.t('metrix', 'Failed to update widget. Please try again.'),
                        error,
                    },
                });
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
            } catch (error) {
                console.error('Error duplicating widget:', error);

                get().updateWidgetState(newWidget, {
                    loading: false,
                    error: {
                        message: Craft.t('metrix', 'Failed to duplicate widget. Please try again.'),
                        error,
                    },
                });
            }
        },

        fetchWidgetData: async(id, { refresh = false } = {}) => {
            const widget = get().widgets.find((w) => { return w.__id === id; });

            if (!widget) {
                console.error(`Widget with id ${id} not found.`);
                return;
            }

            // Update state to indicate loading
            get().updateWidgetState(widget, { loading: true, error: null });

            try {
                const payload = getWidgetDataParams(widget, { refresh });

                const response = await api.get('widget-data', payload);

                // Update with fetched data
                get().updateWidgetState(widget, {
                    chartData: response.data, // Store fetched chart data
                    loading: false,
                });
            } catch (error) {
                get().updateWidgetState(widget, {
                    loading: false,
                    error: {
                        message: getWidgetFetchFaceMessage(error),
                        error,
                    },
                });
            }
        },

        reorderWidgets: async(sourceWidget, targetWidget) => {
            const { widgets } = get();
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

            try {
                // Send the reordered server IDs to the server
                await api.post('save-widget-order', {
                    ids: reorderedWidgets.map((widget) => { return widget.data.id; }).filter(Boolean), // Only server-side IDs
                });
            } catch (error) {
                console.error('Error saving widget order:', error);
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
            set({ widgets: [] });
        },
    };
});

// Apply HMR fix to maintain state
zustandHmrFix('widgetStore', useWidgetStore);

export default useWidgetStore;
