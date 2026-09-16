import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';

vi.mock('@utils', async() => ({
    cn: (...classes) => classes.join(' '),
    ...(await import('../../../utils/format/index.js')),
}));

import { ChartTooltip } from './ChartTooltip.jsx';

it('preserves an observed zero percentage in chart tooltips', () => {
    globalThis.React = React;
    const html = renderToStaticMarkup(<ChartTooltip visibility data={{
        widget: { data: { metricLabel: 'Bounce rate' } },
        tooltipModel: { dataPoints: [{ raw: 0, label: 'Today', dataset: { label: 'Current', yAxisID: 'y', xAxisFormatter: 'string', yAxisFormatter: 'percentage' } }] },
    }} />);
    expect(html).toContain('>0%</span>');
});
