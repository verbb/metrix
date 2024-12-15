// CSS needs to be imported here as it's treated as a module
import '@shared/scss/style.scss';

// Accept HMR as per: https://vitejs.dev/guide/api-hmr.html
if (import.meta.hot) {
    import.meta.hot.accept();
}

if (typeof Craft.Metrix === typeof undefined) {
    Craft.Metrix = {};
}

import { addPortalContainer } from '@utils';

Craft.Metrix.Sources = Garnish.Base.extend({
    init(settings) {
        addPortalContainer();
    },
});