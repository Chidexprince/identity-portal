/**
 * Centralizes server-only configuration for the identity directory upstream.
 *
 * The ReqRes API key is read only inside the server layer.
 * It must never be exposed through NEXT_PUBLIC_* variables or imported by
 * client-side modules.
 */

const REQRES_BASE_URL = 'https://reqres.in/api';

export function getIdentityDirectoryConfig() {
    const apiKey = process.env.REQRES_API_KEY;

    if (!apiKey) {
        throw new Error(
            'Missing REQRES_API_KEY. Add it to .env.local or your deployment environment.',
        );
    }

    return {
        baseUrl: REQRES_BASE_URL,
        apiKey,
    };
}