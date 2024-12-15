import { defineConfig } from 'vite';
import path from 'path';

// Vite Plugins
import ReactPlugin from '@vitejs/plugin-react';
import EslintPlugin from 'vite-plugin-eslint';
import AnalyzePlugin from 'rollup-plugin-analyzer';
import CompressionPlugin from 'vite-plugin-compression';

// PostCSS Plugins
import tailwindcss from 'tailwindcss';
import prefixer from 'postcss-prefix-selector';
import autoprefixer from 'autoprefixer';

export default ({ command }) => defineConfig({
    // Set the root to our source folder
    root: './src/web/assets',

    // When building update the destination base
    base: command === 'serve' ? '' : '/dist/',

    build: {
        outDir: './dist',
        emptyOutDir: true,
        manifest: 'manifest.json',
        sourcemap: true,
        rollupOptions: {
            input: {
                'metrix-cp': path.resolve('./src/web/assets/src/cp/js/metrix-cp.js'),
                'metrix-charts': path.resolve('./src/web/assets/src/charts/js/metrix-charts.js'),
            },
            output: {
                sourcemapExcludeSources: true,
                manualChunks: {
                    chartjs: ['chart.js'],
                    react: ['react', 'react-dom'],
                    dndkit: ['@dnd-kit/core', '@dnd-kit/sortable'],
                },
            },
        },
    },

    server: {
        origin: 'http://localhost:4040',

        hmr: {
            // Using the default `wss` doesn't work on https
            protocol: 'ws',
        },
    },

    plugins: [
        // Keep JS looking good with eslint
        // https://github.com/gxmari007/vite-plugin-eslint
        EslintPlugin({
            cache: false,
            fix: true,
            include: './src/web/assets/**/*.{js,jsx}',
            exclude: './src/web/assets/src/charts/js/vendor/**/*.{js,jsx}',
        }),

        // React support
        // https://github.com/vitejs/vite-plugin-react
        ReactPlugin(),

        // Analyze bundle size
        // https://github.com/doesdev/rollup-plugin-analyzer
        AnalyzePlugin({
            summaryOnly: true,
            limit: 15,
        }),

        // Gzip assets
        // https://github.com/vbenjs/vite-plugin-compression
        CompressionPlugin({
            filter: /\.(js|mjs|json|css|map)$/i,
        }),
    ],

    css: {
        postcss: {
            plugins: [
                tailwindcss,

                // Ensure that we can only use Tailwind in `.metrix-ui` parent containers
                // This prevents style bleed both to and from Craft
                prefixer({
                    prefix: '.metrix-ui',
                    transform: function (prefix, selector, prefixedSelector, filePath, rule) {
                        if (filePath.includes('assets/src/cp/')) {
                            return selector;
                        }

                        return prefixedSelector;
                    }
                }),

                autoprefixer,
            ],
        },

        preprocessorOptions: {
            // Fix Sass 2.0 deprecation issues
            scss: {
                api: 'modern-compiler',
                silenceDeprecations: ['legacy-js-api'],
            },
        },
    },

    resolve: {
        alias: {
            // Reference Tailwind config so we can use in components
            'tailwind.config.js': path.resolve('tailwind.config.js'),

            // Allow shortcuts in JS, CSS and Twig for ease of development.
            '@cp': path.resolve('./src/web/assets/src/cp'),

            '@charts': path.resolve('./src/web/assets/src/charts'),
            '@utils': path.resolve('./src/web/assets/src/charts/js/utils'),
            '@components': path.resolve('./src/web/assets/src/charts/js/components'),
            '@formatters': path.resolve('./src/web/assets/src/charts/js/utils/formatters'),
            '@hooks': path.resolve('./src/web/assets/src/charts/js/hooks'),
        },
    },

    // Add in any components to optimise them early.
    optimizeDeps: {
        include: [
            'lodash-es',
            'tailwind.config.js',
            'chart.js', 
            'react', 
            'react-dom',
        ],
    },
});
