// CSS needs to be imported here as it's treated as a module
import '@shared/scss/style.scss';

// Accept HMR as per: https://vitejs.dev/guide/api-hmr.html
if (import.meta.hot) {
    import.meta.hot.accept();
}

if (typeof Craft.Metrix === typeof undefined) {
    Craft.Metrix = {};
}

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

import { SourceConnect } from '@sources/components/SourceConnect.jsx';

import { addPortalContainer } from '@utils';

Craft.Metrix.SourceConnect = Garnish.Base.extend({
    init(settings) {
        addPortalContainer();

        const container = document.querySelector('.metrix-integration-connect');

        if (container) {
            const root = createRoot(container);

            root.render(createElement(SourceConnect, {
                connected: false,
            }));
        }
    },
});
