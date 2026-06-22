/**
 * Server-only service responsible for calling ReqRes and returning sanitized identity users.
 *
 * This isolates external API communication from route handlers and keeps the route thin.
 */

import type {
    ReqResSingleUserResponse,
    ReqResUsersResponse,
} from './identity-directory.types';
import { mapReqResUserToIdentityUser } from './identity-directory.mapper';

const REQRES_BASE_URL = 'https://reqres.in/api';

export async function getIdentityUsers() {
    const response = await fetch(`${REQRES_BASE_URL}/users?page=1`, {
        /**
         * BFF cache decision:
         * 
         * We keep the server fetch dynamic so client-side staleTime/gcTime decisions are explicit.
         */
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users from identity upstream');
    }

    const payload = (await response.json()) as ReqResUsersResponse;

    return payload.data.map(mapReqResUserToIdentityUser);
}

export async function getIdentityUserById(id: string) {
    const response = await fetch(`${REQRES_BASE_URL}/users/${id}`, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user from identity upstream');
    }

    const payload = (await response.json()) as ReqResSingleUserResponse;

    return mapReqResUserToIdentityUser(payload.data);
}