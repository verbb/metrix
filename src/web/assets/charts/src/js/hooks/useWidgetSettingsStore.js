import { create } from 'zustand';
import { api } from '@utils';

const useWidgetSettingsStore = create((set, get) => {
    return {
        metrics: {}, // Store metrics by source
        dimensions: {}, // Store dimensions by source
        metricsLoaded: {}, // Track loaded states for metrics
        dimensionsLoaded: {}, // Track loaded states for dimensions
        settings: {}, // Widget settings schemas

        // Load all widget settings schemas
        loadSettings: (settingsData) => {
            const settings = settingsData.reduce((acc, setting) => {
                acc[setting.type] = setting.schema;
                return acc;
            }, {});

            set({ settings });
        },

        // Get schema for a specific widget type
        getSettingsByType: (type) => {
            return get().settings[type];
        },

        // Fetch metrics for a given source
        fetchMetrics: async(source) => {
            if (get().metricsLoaded[source]) {
                return get().metrics[source] || [];
            }

            const metrics = await api.get('metrics-data', { source });

            set((state) => {
                return {
                    metrics: { ...state.metrics, [source]: metrics },
                    metricsLoaded: { ...state.metricsLoaded, [source]: true },
                };
            });

            return metrics;
        },

        // Fetch dimensions for a given source
        fetchDimensions: async(source) => {
            if (get().dimensionsLoaded[source]) {
                return get().dimensions[source] || [];
            }

            const dimensions = await api.get('dimensions-data', { source });

            set((state) => {
                return {
                    dimensions: { ...state.dimensions, [source]: dimensions },
                    dimensionsLoaded: { ...state.dimensionsLoaded, [source]: true },
                };
            });

            return dimensions;
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

zustandHmrFix('widgetSettingsStore', useWidgetSettingsStore);

export default useWidgetSettingsStore;
