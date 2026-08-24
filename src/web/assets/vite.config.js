import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

import ReactPlugin from '@vitejs/plugin-react';
import TailwindPlugin from '@tailwindcss/vite';
import TailwindShadowDOM from 'vite-plugin-tailwind-shadowdom';
import AnalyzePlugin from 'rollup-plugin-analyzer';
import CompressionPlugin from 'vite-plugin-compression';

const assetsRoot = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.resolve(assetsRoot, './src');
const distRoot = path.resolve(assetsRoot, './dist');

const cpBundleDirectories = {
    'metrix-dashboard': 'src/dashboard',
    'metrix-presets': 'src/presets',
    'metrix-sources': 'src/sources',
    'metrix-cp': 'src/cp',
    'metrix-cp-styles': 'src/cp',
};

const getCpBundleDirectory = (bundleName) => cpBundleDirectories[bundleName] ?? null;

// Canonical kit chunking, mirrored from Formie's `createManualChunkName`. Splitting the
// kit React facades / WC components / register across chunks produces reciprocal import
// cycles (static: PHP ManifestHelper hangs; dynamic: CP spinner never clears), so they
// must resolve into a single `plugin-kit` chunk.
const createManualChunkName = (id) => {
    const isKitPackagePath = id.includes('plugin-kit-repo/') || id.includes('@verbb/plugin-kit-');

    if (!id.includes('node_modules') && !isKitPackagePath) {
        return null;
    }

    if (
        (
            (id.includes('plugin-kit-web') || id.includes('plugin-kit-repo/plugin-kit-web'))
            && (
                id.includes('/components/')
                || id.includes('/register')
                || id.includes('/plugin-kit')
            )
        )
        || id.includes('/node_modules/@verbb/plugin-kit-react/')
        || id.includes('plugin-kit-repo/plugin-kit-react')
    ) {
        return 'plugin-kit';
    }

    if (id.includes('/node_modules/@verbb/plugin-kit-forms/')) {
        return 'plugin-kit-forms';
    }

    if (
        id.includes('/node_modules/@verbb/plugin-kit-core/')
        || id.includes('plugin-kit-repo/plugin-kit-core')
    ) {
        return 'plugin-kit-core';
    }

    if (id.includes('/node_modules/lit/')) {
        return 'lit';
    }

    if (id.includes('/node_modules/chart.js')) {
        return 'chartjs';
    }

    if (
        id.includes('/node_modules/@dnd-kit/core')
        || id.includes('/node_modules/@dnd-kit/sortable')
    ) {
        return 'dndkit';
    }

    if (
        id.includes('/node_modules/react/')
        || id.includes('/node_modules/react-dom/')
    ) {
        return 'react-vendor';
    }

    return null;
};

export default defineConfig({
    root: assetsRoot,

    // CP production bundles are published under Craft's cpresources path, so build with
    // a relative base to keep lazy chunks resolving beside the published entrypoint.
    base: '',

    build: {
        outDir: distRoot,
        emptyOutDir: true,
        manifest: 'manifest.json',
        sourcemap: true,
        rollupOptions: {
            input: {
                'metrix-cp-styles': path.resolve(srcRoot, './cp/metrix-cp-styles.js'),
                'metrix-cp': path.resolve(srcRoot, './cp/js/metrix-cp.js'),
                'metrix-dashboard': path.resolve(srcRoot, './dashboard/metrix-dashboard.js'),
                'metrix-presets': path.resolve(srcRoot, './presets/metrix-presets.js'),
                'metrix-sources': path.resolve(srcRoot, './sources/metrix-sources.js'),
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    const bundleDirectory = getCpBundleDirectory(chunkInfo.name);

                    if (bundleDirectory) {
                        return `${bundleDirectory}/js/[name].js`;
                    }

                    return 'assets/[name]-[hash].js';
                },
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    const assetFileName = assetInfo.names?.[0] ?? assetInfo.name ?? '';
                    const assetBaseName = path.basename(assetFileName, path.extname(assetFileName));

                    if (assetBaseName === 'metrix-cp-styles' || assetBaseName === 'metrix-cp') {
                        return 'src/cp/css/metrix-cp[extname]';
                    }

                    const bundleDirectory = getCpBundleDirectory(assetBaseName);

                    if (bundleDirectory) {
                        return `${bundleDirectory}/css/[name][extname]`;
                    }

                    return 'assets/[name]-[hash][extname]';
                },
                sourcemapExcludeSources: true,
                manualChunks: createManualChunkName,
            },
        },
    },

    server: {
        origin: 'http://localhost:4040',
        port: 4040,
        strictPort: true,
        cors: true,
        hmr: {
            protocol: 'ws',
        },
    },

    plugins: [
        ReactPlugin(),
        TailwindPlugin(),
        TailwindShadowDOM(),
        AnalyzePlugin({
            summaryOnly: true,
            limit: 15,
        }),
        CompressionPlugin({
            filter: /\.(js|mjs|json|css|map)$/i,
        }),
    ],

    resolve: {
        dedupe: [
            'react',
            'react-dom',
            '@lit/react',
            '@lit/reactive-element',
            'lit',
            'lit-element',
            'lit-html',
            '@verbb/plugin-kit-icons',
            '@verbb/plugin-kit-web',
            '@verbb/plugin-kit-core',
        ],

        alias: {
            '@components': path.resolve(srcRoot, './components'),
            '@hooks': path.resolve(srcRoot, './hooks'),
            '@icons': path.resolve(srcRoot, './icons'),
            '@utils': path.resolve(srcRoot, './utils'),

            '@dashboard': path.resolve(srcRoot, './dashboard'),
            '@presets': path.resolve(srcRoot, './presets'),
            '@sources': path.resolve(srcRoot, './sources'),
        },
    },

    optimizeDeps: {
        include: [
            'lodash-es',
            'chart.js',
            'react',
            'react-dom',
            'lit',
            '@verbb/plugin-kit-core',
            '@verbb/plugin-kit-forms',
            '@verbb/plugin-kit-react',
        ],
    },
});
