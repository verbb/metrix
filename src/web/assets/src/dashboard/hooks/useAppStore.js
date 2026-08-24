import { create } from 'zustand';

import { zustandHmrFix } from '@utils/store';

const useAppStore = create((set) => {
    return {
        currentView: null,
        realtimeInterval: null,
        presets: [],
        sources: [],
        viewOptions: [],
        newWidget: {},
        periodOptions: [],

        setCurrentView: (currentView) => {
            return set({ currentView });
        },

        setRealtimeInterval: (realtimeInterval) => {
            return set({ realtimeInterval });
        },

        setPresets: (presets) => {
            return set({ presets });
        },

        setSources: (sources) => {
            return set({ sources });
        },

        setViewOptions: (viewOptions) => {
            return set({ viewOptions });
        },

        setNewWidget: (newWidget) => {
            return set({ newWidget });
        },

        setPeriodOptions: (periodOptions) => {
            return set({ periodOptions });
        },
    };
});

// Apply HMR fix to maintain state
zustandHmrFix('appStore', useAppStore);

export default useAppStore;
