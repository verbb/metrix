import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from 'tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

export const { theme } = fullConfig;

export function hexToRgba(hex, alpha) {
    const [r, g, b] = hex.match(/\w\w/g).map((c) => { return parseInt(c, 16); });

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
