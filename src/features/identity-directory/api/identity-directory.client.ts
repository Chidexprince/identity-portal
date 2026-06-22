/**
 * Client-side API functions for the identity directory feature.
 *
 * The browser calls our Next.js BFF routes, never the upstream ReqRes API.
 * This keeps the frontend dependent on our client-safe contract rather than
 * the external provider shape.
 */

import type {
    IdentityUser,
    IdentityUserResponse,
    IdentityUsersResponse,
} from '../types/identity-user';

async function parseJsonResponse<TResponse>(response: Response): Promise<TResponse> {
    if (!response.ok) {
        throw new Error('Identity directory request failed');
    }

    return response.json() as Promise<TResponse>;
}

export async function fetchIdentityUsers(): Promise<IdentityUser[]> {
    const response = await fetch('/api/users');
    const payload = await parseJsonResponse<IdentityUsersResponse>(response);

    return payload.users;
}

export async function fetchIdentityUserById(
    userId: number,
): Promise<IdentityUser> {
    const response = await fetch(`/api/users/${userId}`);
    const payload = await parseJsonResponse<IdentityUserResponse>(response);

    return payload.user;
}