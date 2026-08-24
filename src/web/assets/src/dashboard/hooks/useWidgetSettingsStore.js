import { create } from 'zustand';
import { api } from '@utils';

import { zustandHmrFix } from '@utils/store';

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
        getSettingsByType: (type, source) => {
            const schema = get().settings[type];

            if (!schema) {
                return [];
            }

            // Map over schema fields and dynamically modify metrics/dimensions
            return schema.map((field) => {
                if (field.name === 'metric') {
                    return {
                        ...field,
                        // Eager-load full list on mount (Metrix EagerComboboxField), not typeahead async.
                        loadKey: source || '',
                        loadOptions: () => { return get().fetchMetrics(source); },
                    };
                }

                if (field.name === 'dimension') {
                    return {
                        ...field,
                        loadKey: source || '',
                        loadOptions: () => { return get().fetchDimensions(source); },
                    };
                }

                return field;
            });
        },

        // Fetch metrics for a given source
        fetchMetrics: async(source) => {
            if (get().metricsLoaded[source]) {
                return get().metrics[source] || [];
            }

            const { data: metrics } = await api.get('property-options', { property: 'metrics', source });

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

            const { data: dimensions } = await api.get('property-options', { property: 'dimensions', source });

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
zustandHmrFix('widgetSettingsStore', useWidgetSettingsStore);

export default useWidgetSettingsStore;
