/**
 * Server-side service for identity directory use cases.
 *
 * This service coordinates the identity directory workflow:
 * - fetch raw user data from the upstream client
 * - validate domain expectations
 * - map raw upstream data into the client-safe identity contract
 *
 * It does not know about low-level fetch options, headers, API keys, or timeout
 * mechanics.
 */

import type {
    IdentityUserResponse,
    IdentityUsersResponse,
} from '@/features/identity-directory/types/identity-user';
import { IdentityDirectoryNotFoundError } from './identity-directory.errors';
import {
    mapReqResSingleUserResponseToIdentityUserResponse,
    mapReqResUsersResponseToIdentityUsersResponse,
} from './identity-directory.mapper';
import {
    fetchIdentityUserByIdFromUpstream,
    fetchIdentityUsersFromUpstream,
} from './identity-directory.client';

export async function getIdentityUsers(): Promise<IdentityUsersResponse> {
    const response = await fetchIdentityUsersFromUpstream();

    return mapReqResUsersResponseToIdentityUsersResponse(response);
}

export async function getIdentityUserById(
    userId: number,
): Promise<IdentityUserResponse> {
    const response = await fetchIdentityUserByIdFromUpstream(userId);

    if (!response.data) {
        throw new IdentityDirectoryNotFoundError(userId);
    }

    return mapReqResSingleUserResponseToIdentityUserResponse(response);
}