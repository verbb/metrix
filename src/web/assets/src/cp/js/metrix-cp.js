// CSS needs to be imported here as it's treated as a module
import '../scss/style.scss';

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
        const $select = $container.find('select');
        const source = $btn.data('source');
        const setting = $btn.data('refresh-settings');

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

        const setError = function(text) {
            let $error = $container.find('.mui-error');

            if (!text) {
                $error.remove();
            }

            if (!$error.length) {
                $error = $('<div class="mui-error error"></div>').appendTo($container);
            }

            $error.html(text);
        };

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

        $btn.addClass('mui-loading mui-loading-sm');

        setError(null);

        Craft.sendActionRequest('POST', 'metrix/sources/refresh-settings', { data })
            .then((response) => {
                if (response.data.error) {
                    let errorMessage = Craft.t('metrix', 'An error occurred.');

                    if (response.data.error) {
                        errorMessage += `<br><code>${response.data.error}</code>`;

                        if (response.data.file && response.data.line) {
                            errorMessage += `<br><code>${response.data.file}:${response.data.line}</code>`;
                        }
                    }

                    setError(errorMessage);

                    return;
                }

                setSelect(response.data);
            })
            .catch((error) => {
                let errorMessage = error;

                if (error.response && error.response.data && error.response.data.error) {
                    errorMessage += `<br><code>${error.response.data.error}</code>`;

                    if (error.response.data.file && error.response.data.line) {
                        errorMessage += `<br><code>${error.response.data.file}:${error.response.data.line}</code>`;
                    }
                }

                setError(errorMessage);
            })
            .finally(() => {
                $btn.removeClass('mui-loading mui-loading-sm');
            });
    });

})(jQuery);
