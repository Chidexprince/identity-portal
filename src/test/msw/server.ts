/**
 * MSW test server setup.
 *
 * This server intercepts HTTP requests during Vitest tests. It allows component
 * integration tests to exercise the real BFF client code without making real
 * network calls.
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);