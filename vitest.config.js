import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(root, 'src/web/assets/src');

export default defineConfig({
    resolve: {
        alias: {
            '@components': path.resolve(src, 'components'),
            '@hooks': path.resolve(src, 'hooks'),
            '@icons': path.resolve(src, 'icons'),
            '@utils': path.resolve(src, 'utils'),
            '@dashboard': path.resolve(src, 'dashboard'),
            '@presets': path.resolve(src, 'presets'),
            '@sources': path.resolve(src, 'sources'),
        },
    },
    test: {
        include: ['src/**/*.test.{js,jsx,ts,tsx}'],
    },
});
