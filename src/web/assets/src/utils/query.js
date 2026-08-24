export const getQueryParam = (key) => {
    const params = new URLSearchParams(window.location.search);

    return params.get(key);
};

export const setQueryParam = (key, value) => {
    const params = new URLSearchParams(window.location.search);

    params.set(key, value);

    const newUrl = `${window.location.pathname}?${params.toString()}`;

    window.history.pushState({}, '', newUrl);
};
