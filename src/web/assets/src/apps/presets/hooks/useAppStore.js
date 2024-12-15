import { create } from 'zustand';

import { zustandHmrFix } from '@utils/store';

const useAppStore = create((set) => {
    return {
        newWidget: {},

        setNewWidget: (newWidget) => {
            return set({ newWidget });
        },
    };
});

// Apply HMR fix to maintain state
zustandHmrFix('appStore', useAppStore);

export default useAppStore;
