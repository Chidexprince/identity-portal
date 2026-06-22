/// <reference types="vitest" />

/**
 * Vitest configuration for unit and integration tests.
 *
 * The alias mirrors the Next.js `@/*` import convention so tests can use
 * the same import paths as production code.
 */

import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});