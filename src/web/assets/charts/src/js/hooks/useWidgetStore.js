import { create } from 'zustand';
import { nanoid } from 'nanoid';

const useWidgetStore = create((set, get) => {
    return {
        widgets: [],

        loadWidgets: (widgetData) => {
            const widgets = widgetData.map((widget) => {
                return {
                    ...widget,
                    __id: nanoid(),
                };
            });

            set({ widgets });
        },

        // Don't use this for now, too many reactive issues when fetching from a store
        // we get much better results just passing the widget object around...
        // getWidgetById: (id) => {
        //     return get().widgets.find((widget) => {
        //         return widget.__id === id;
        //     });
        // },

        updateWidget: (id, updates) => {
            set((state) => {
                const widgets = state.widgets.map((widget) => {
                    if (widget.__id === id) {
                        return { ...widget, ...updates };
                    }

                    return widget;
                });

                return { widgets };
            });
        },

        removeWidget: (id) => {
            set((state) => {
                const widgets = state.widgets.filter((widget) => {
                    return widget.__id !== id;
                });

                return { widgets };
            });
        },

        addWidget: (widget) => {
            const newWidget = { ...widget, __id: nanoid() };

            set((state) => {
                return { widgets: [...state.widgets, newWidget] };
            });
        },

        reorderWidgets: (orderArray) => {
            set((state) => {
                const widgets = orderArray.map((id) => {
                    return state.widgets.find((widget) => {
                        return widget.__id === id;
                    });
                }).filter(Boolean); // Remove any undefined widgets

                return { widgets };
            });
        },

        clearWidgets: () => {
            set({ widgets: [] });
        },
    };
});

// Apply HMR fix to maintain state
export const zustandHmrFix = (name, useStore) => {
    if (import.meta.hot) {
        const state = import.meta.hot.data[name];

        if (state) {
            useStore.setState(import.meta.hot.data[name]);
        }

        useStore.subscribe((state) => {
            import.meta.hot.data[name] = state;
        });

        import.meta.hot.accept((newModule) => {
            if (newModule) {
                useStore.setState(import.meta.hot.data[name]);
            }
        });
    }
};

zustandHmrFix('widgetStore', useWidgetStore);

export default useWidgetStore;
