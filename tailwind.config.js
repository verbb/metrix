import tailwindcssAnimate from 'tailwindcss-animate';
import tailwindcssForms from '@tailwindcss/forms';

import { CHART_COLORS, WIDGET_HEIGHT, WIDGET_HEIGHTS } from './src/web/assets/src/shared/utils/constants';

export default {
    // Prefix classes so Craft's don't interfere, and vice versa
    prefix: 'mc-',

    content: [
        // Scan the files in these directories for what _not_ to purge
        './src/templates/**/*.{twig,html}',
        './src/web/assets/src/**/*.{js,jsx}',
    ],

    theme: {
        // Extend the default Tailwind config
        extend: {
            spacing: WIDGET_HEIGHTS,
            height: WIDGET_HEIGHTS,

            gridAutoRows: {
                widgets: `minmax(${WIDGET_HEIGHT}rem, auto)`,
            },

            animation: {
                spin: 'spin 0.5s linear infinite',
            },

            boxShadow: {
                inputRing: '0 0 0 1px #0f74b1, 0 0 0 3px #0f74b1cc',
            },

            colors: {
                chart: CHART_COLORS.reduce((acc, color, index) => {
                    acc[index + 1] = color; // Assign numeric keys

                    return acc;
                }, {}),
            },
        },
    },

    // ================================================
    // Ensure you document all plugins in use
    // ================================================
    plugins: [
        // A unopinionated forms reset
        // https://github.com/tailwindlabs/tailwindcss-forms
        // tailwindcssForms,

        // Handy animations
        // https://github.com/jamiebuilds/tailwindcss-animate
        tailwindcssAnimate,
    ],
}