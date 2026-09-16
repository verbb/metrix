import { expect, it } from 'vitest';
import { applyWidgetFieldEffects } from './widgetFieldEffects';

it('uses an explicitly selected settings period instead of the dashboard range', () => {
    const previous = { source: 'analytics', type: 'Line', period: 'Last7Days', inheritPeriod: true };
    const { updated } = applyWidgetFieldEffects(previous, { ...previous, period: 'Last30Days' }, {});

    expect(updated.inheritPeriod).toBe(false);
    expect(updated.period).toBe('Last30Days');
});

it('keeps dashboard inheritance when editing another setting', () => {
    const previous = { source: 'analytics', type: 'Line', period: 'Last7Days', inheritPeriod: true };
    const { updated } = applyWidgetFieldEffects(previous, { ...previous, title: 'Visitors' }, {});

    expect(updated.inheritPeriod).toBe(true);
});
