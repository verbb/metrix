import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';

vi.mock('@verbb/plugin-kit-react/components/Combobox', () => ({ Combobox: ({ children, ...props }) => <div role="combobox" aria-label={props['aria-label']}>{children}</div> }));
vi.mock('@verbb/plugin-kit-react/components/ComboboxInput', () => ({ ComboboxInput: (props) => <input role="combobox" aria-label={props['aria-label']} /> }));
vi.mock('@verbb/plugin-kit-react/components/Select', () => ({ Option: ({ children }) => <span>{children}</span>, OptionGroup: ({ children }) => <div>{children}</div> }));
vi.mock('@verbb/plugin-kit-react/components/Spinner', () => ({ Spinner: () => null }));
vi.mock('@verbb/plugin-kit-react/forms/Field', () => ({ FieldLayout: ({ children }) => <div>{children}</div> }));
vi.mock('@verbb/plugin-kit-react/forms/useEngineField', () => ({ useEngineField: () => ({ value: '', setValue: vi.fn(), setTouched: vi.fn(), errors: [], isInvalid: false }) }));

import { EagerComboboxField } from './EagerComboboxField.jsx';

it.each([{ options: [] }, { options: [{ label: 'Visitors', value: 'visitors', group: 'Common' }] }])('names the custom metric input with and without grouped options', ({ options }) => {
    globalThis.React = React;
    globalThis.Craft = { t: (_category, message) => message };
    const html = renderToStaticMarkup(<EagerComboboxField form={{}} field={{ name: 'metric', label: 'Metric', options }} />);

    expect(html).toContain('aria-label="Metric"');
});
