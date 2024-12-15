export const api = {
    get(url, payload = {}) {
        const actionUrl = `metrix/dashboard/${url}`;

        return Craft.sendActionRequest('GET', actionUrl, { params: payload });
    },

    post(url, payload = {}) {
        const actionUrl = `metrix/dashboard/${url}`;

        return Craft.sendActionRequest('POST', actionUrl, { data: payload });
    },
};
