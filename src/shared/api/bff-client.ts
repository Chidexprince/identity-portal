/**
 * Shared browser-side BFF client.
 *
 * This module centralizes low-level HTTP concerns for frontend-to-BFF calls:
 * - JSON parsing
 * - error normalization
 * - no-store request policy
 * - same-origin credentials
 *
 * It is safe for browser usage because it does not contain secrets and only
 * calls internal application routes such as /api/users.
 */

export type BffErrorResponse = {
    message?: string;
};

export class BffClientError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
    ) {
        super(message);
        this.name = 'BffClientError';
    }
}

type BffRequestOptions = {
    signal?: AbortSignal;
};

export async function getBffJson<TResponse>(
    url: string,
    options: BffRequestOptions = {},
): Promise<TResponse> {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },

        /**
         * The browser should not introduce an extra HTTP cache layer.
         *
         * TanStack Query owns the client-side memory cache lifecycle through
         * explicit staleTime and gcTime values.
         */
        cache: 'no-store',

        /**
         * Keeps requests same-origin. Useful if the BFF later relies on cookies,
         * CSRF protection, or session-based authentication.
         */
        credentials: 'same-origin',

        signal: options.signal,
    });

    if (!response.ok) {
        const errorBody = await response
            .json()
            .catch(() => null) as BffErrorResponse | null;

        throw new BffClientError(
            errorBody?.message ?? 'BFF request failed.',
            response.status,
        );
    }

    return response.json() as Promise<TResponse>;
}