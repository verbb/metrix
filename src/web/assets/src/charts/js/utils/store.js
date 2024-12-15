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
