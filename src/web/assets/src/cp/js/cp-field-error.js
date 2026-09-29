import { resolveConnectError } from '@verbb/plugin-kit-core';

/**
 * Translated labels for CP field-level AJAX errors (refresh-settings, etc.).
 * Same contract as pk-connect / Formie integration refresh fields.
 */
export function getCpFieldErrorLabels() {
    return {
        errorHeading: Craft.t('metrix', 'An error occurred.'),
        genericError: Craft.t('metrix', 'Failed to load options. Please try again.'),
    };
}

/**
 * Normalize Craft / Axios failures into `{ heading, text, traceAsString }`.
 */
export function parseCpFieldError(sourceError, labels = getCpFieldErrorLabels()) {
    return resolveConnectError(sourceError, labels);
}

export function clearCpFieldError(container) {
    if (!container) {
        return;
    }

    container.querySelectorAll('.metrix-field-error, .metrix-error').forEach((element) => {
        element.remove();
    });
}

/**
 * Inline field error below a control — mirrors Formie `IntegrationErrorMessage`
 * and pk-connect `.pk-connection-error` (heading, message, optional trace details).
 */
export function mountCpFieldError(container, sourceError, labels = getCpFieldErrorLabels()) {
    clearCpFieldError(container);

    if (!sourceError || !container) {
        return;
    }

    const error = parseCpFieldError(sourceError, labels);
    const root = document.createElement('div');
    root.className = 'metrix-field-error';

    const heading = document.createElement('p');
    heading.className = 'metrix-field-error__heading';
    heading.textContent = error.heading;
    root.appendChild(heading);

    const message = document.createElement('p');
    message.className = 'metrix-field-error__message';
    message.textContent = error.text;
    root.appendChild(message);

    const trace = error.traceAsString || error.trace || '';

    if (trace) {
        const details = document.createElement('details');
        details.className = 'metrix-field-error__details';

        const summary = document.createElement('summary');
        summary.className = 'metrix-field-error__details-toggle';
        summary.textContent = Craft.t('metrix', 'Show details');
        details.appendChild(summary);

        const traceEl = document.createElement('div');
        traceEl.className = 'metrix-field-error__trace';
        // traceAsString is server-formatted HTML from getErrorMessage (file:line, stack).
        traceEl.innerHTML = trace;
        details.appendChild(traceEl);

        root.appendChild(details);
    }

    container.appendChild(root);
}
