/**
 * Global Vitest setup.
 *
 * This wires jest-dom matchers and starts the MSW server so tests can exercise
 * real HTTP flows against mocked BFF endpoints.
 */

import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './msw/server';

beforeAll(() => {
    server.listen({
        onUnhandledRequest: 'error',
    });
});

afterEach(() => {
    server.resetHandlers();
});

afterAll(() => {
    server.close();
});