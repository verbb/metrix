import { expect, it } from 'vitest';
import { getWidgetComponent } from './widgets.js';

it.each(['Bar', 'Counter', 'Line', 'Pie', 'Realtime', 'Table'])('exposes %s preset metadata before its chart component loads', (name) => {
    globalThis.Craft = { Metrix: { Config: { getRegisteredWidget: () => null } } };
    const component = getWidgetComponent(`verbb\\metrix\\widgets\\${name}`);

    expect(component.meta?.name).toBe(name);
    expect(component.meta?.icon).toBeTruthy();
});
