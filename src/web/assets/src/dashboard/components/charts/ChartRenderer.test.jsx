import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';

vi.mock('@dashboard/components/charts/Chart', () => ({ Line: () => <canvas />, Bar: () => <canvas />, Doughnut: () => <canvas /> }));
vi.mock('@dashboard/components/charts/ChartTooltip', () => ({ ChartTooltip: () => null }));
vi.mock('@dashboard/components/charts/chartOptions', () => ({ CHART_PANE_HEIGHT: 200 }));

import { ChartRenderer } from './ChartRenderer.jsx';

it('provides chart values and comparison series as an accessible table', () => {
    globalThis.React = React;
    globalThis.Craft = { t: (_category, message) => message };
    const html = renderToStaticMarkup(<ChartRenderer label="Site sessions" dimensionLabel="Date" chartProps={{ data: {
        labels: ['2026-09-14', '2026-09-15'],
        datasets: [{ label: 'Sessions', data: [0, null] }, { label: 'Previous period', data: [12, 8] }],
    } }} />);

    expect(html).toContain('<caption>Site sessions</caption>');
    expect(html).toContain('<th scope="col">Previous period</th>');
    expect(html).toContain('<th scope="row">2026-09-14</th><td>0</td><td>12</td>');
    expect(html).toContain('<td>No data</td><td>8</td>');
});
