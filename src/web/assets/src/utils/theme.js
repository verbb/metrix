// Chart axis label colour — matches legacy theme.colors.slate[600].
export const CHART_AXIS_LABEL_COLOR = 'rgba(96, 125, 159, 0.6)';

// Table row bar fill — legacy Tailwind `green-50` from metrix-before.
export const TABLE_ROW_BAR_COLOR = '#f0fdf4';

export function hexToRgba(hex, alpha) {
    const [r, g, b] = hex.match(/\w\w/g).map((c) => parseInt(c, 16));

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
