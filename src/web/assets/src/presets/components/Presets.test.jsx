import React from 'react';
import { beforeEach, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ setWidgets: vi.fn() }));
vi.mock('react', async(importOriginal) => ({
    ...await importOriginal(),
    useState: (value) => [value, state.setWidgets],
    useEffect: () => {},
}));
vi.mock('@dnd-kit/core', () => ({
    DndContext: 'dnd-context', closestCenter: vi.fn(), useSensor: vi.fn(), useSensors: vi.fn(), PointerSensor: {}, KeyboardSensor: {},
}));
vi.mock('@verbb/plugin-kit-react/components/Button', () => ({ Button: 'button' }));
vi.mock('@verbb/plugin-kit-react/components/Dialog', () => ({ Dialog: 'dialog' }));
vi.mock('@verbb/plugin-kit-react/components/Icon', () => ({ Icon: 'span' }));
vi.mock('@components/WidthPicker', () => ({ WidthPicker: () => null }));
vi.mock('@presets/components/PresetNew', () => ({ PresetNew: () => null }));
vi.mock('@presets/components/PresetSettings', () => ({ PresetSettings: () => null }));
vi.mock('@utils', () => ({ cn: (...classes) => classes.join(' ') }));

import { Presets } from './Presets.jsx';

beforeEach(() => {
    vi.clearAllMocks();
    globalThis.React = React;
    globalThis.Craft = { t: (_category, message) => message };
});

it('leaves preset widgets unchanged when a drag ends outside the list', () => {
    const tree = Presets({ widgets: [{ __id: 'first', data: {} }, { __id: 'second', data: {} }] });
    const findDrag = (node) => {
        if (!node || typeof node !== 'object') return null;
        if (node.props?.onDragEnd) return node.props.onDragEnd;
        return React.Children.toArray(node.props?.children).map(findDrag).find(Boolean);
    };

    const onDragEnd = findDrag(tree);
    expect(onDragEnd).toBeTypeOf('function');
    expect(() => onDragEnd({ active: { id: 'first' }, over: null })).not.toThrow();
    expect(state.setWidgets).not.toHaveBeenCalled();
});
