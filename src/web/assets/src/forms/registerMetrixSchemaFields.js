import { registerFormFields } from '@verbb/plugin-kit-react/forms';

import { EagerComboboxField } from './EagerComboboxField.jsx';

let registered = false;

/**
 * Register Metrix-owned SchemaForm `$field` types. Call from every entry that
 * mounts widget settings (dashboard + presets).
 */
export function registerMetrixSchemaFields() {
    if (registered) {
        return;
    }

    registerFormFields({
        eagerCombobox: EagerComboboxField,
    });

    registered = true;
}
