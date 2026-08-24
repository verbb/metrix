import {
    clearCpFieldError,
    getCpFieldErrorLabels,
    mountCpFieldError,
} from './cp-field-error.js';

// Accept HMR as per: https://vitejs.dev/guide/api-hmr.html
if (import.meta.hot) {
    import.meta.hot.accept();
}

if (typeof Craft.Metrix === typeof undefined) {
    Craft.Metrix = {};
}

(function($) {
    $(document).on('click', '[data-refresh-settings]', function(e) {
        e.preventDefault();

        const $btn = $(this);
        const $container = $btn.parent().parent();
        const container = $container[0];
        const $select = $container.find('select');
        const source = $btn.data('source');
        const setting = $btn.data('refresh-settings');
        const labels = getCpFieldErrorLabels();

        const data = {
            source,
            setting,
        };

        // Add the current data to the payload, so it can be loaded into the source
        // Think multi-step provider options.
        const $form = $btn.parents('form');
        const sourceClass = $btn.data('source-class');
        const formData = Craft.expandPostArray(Garnish.getPostData($form));

        data.sourceData = formData.types[sourceClass];

        const setSelect = function(values) {
            const currentValue = $select.val();
            let options = '';

            $.each(values, (key, option) => {
                options += `<option value="${option.value}">${option.label}</option>`;
            });

            $select.html(options);

            // Set any original value back
            if (currentValue) {
                $select.val(currentValue);
            }
        };

        $btn.addClass('metrix-loading metrix-loading-sm');

        clearCpFieldError(container);

        Craft.sendActionRequest('POST', 'metrix/sources/refresh-settings', { data })
            .then((response) => {
                if (response.data?.error) {
                    mountCpFieldError(container, { data: response.data }, labels);

                    return;
                }

                setSelect(response.data);
            })
            .catch((error) => {
                mountCpFieldError(container, error, labels);
            })
            .finally(() => {
                $btn.removeClass('metrix-loading metrix-loading-sm');
            });
    });

})(jQuery);
