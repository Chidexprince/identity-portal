/**
 * Provides a small server-only HTTP client wrapper.
 *
 * This file contains generic transport-level behavior that can be reused by
 * multiple server-side domains:
 * - request timeout
 * - JSON parsing
 * - HTTP status validation
 * - explicit cache control
 *
 * It does not know about ReqRes, identity users, or any business domain.
 * 
 */

export type ServerHttpClientOptions = {
    headers?: HeadersInit;
    timeoutMs?: number;
};

export class ServerHttpError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
    ) {
        super(message);
        this.name = 'ServerHttpError';
    }
}

const DEFAULT_TIMEOUT_MS = 5_000;

export async function getJson<TResponse>(
    url: string,
    options: ServerHttpClientOptions = {},
): Promise<TResponse> {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            ...options.headers,
        },

        /**
         * Keeps the BFF transport deterministic.
         *
         * TanStack Query owns the visible client-side cache
         * lifecycle. We do not want hidden server fetch caching to interfere with
         * staleTime/gcTime.
         */
        cache: 'no-store',

        signal: AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    });

    if (!response.ok) {
        throw new ServerHttpError('Server HTTP request failed.', response.status);
    }

    return response.json() as Promise<TResponse>;
}