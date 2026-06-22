/**
 * Maps raw ReqRes upstream data into client-safe identity directory contracts.
 *
 * This is the core BFF sanitization layer. It prevents the frontend from
 * depending on ReqRes field names and gives us a controlled place to enrich,
 * remove, rename, or normalize identity data before it reaches the browser.
 */

import type {
    IdentityUser,
    IdentityUserResponse,
    IdentityUsersResponse,
} from '@/features/identity-directory/types/identity-user';
import type {
    ReqResSingleUserResponse,
    ReqResUser,
    ReqResUsersResponse,
} from './identity-directory.types';

export function mapReqResUserToIdentityUser(user: ReqResUser): IdentityUser {
    return {
        id: user.id,
        email: user.email,

        /**
         * We expose a frontend-friendly displayName instead of leaking ReqRes'
         * first_name and last_name fields into the client contract.
         */
        displayName: `${user.first_name} ${user.last_name}`,

        /**
         * Rename avatar to avatarUrl so the client receives a clearer UI-facing
         * field name.
         */
        avatarUrl: user.avatar,

        /**
         * Mock server-side enrichment to simulate enterprise identity policy.
         * This should be decided by the server, not the untrusted browser.
         */
        requiresMFA: true,
        accountStatus: 'active',
    };
}

export function mapReqResUsersResponseToIdentityUsersResponse(
    response: ReqResUsersResponse,
): IdentityUsersResponse {
    return {
        users: response.data.map(mapReqResUserToIdentityUser),
        page: response.page,
        perPage: response.per_page,
        total: response.total,
        totalPages: response.total_pages,
    };
}

export function mapReqResSingleUserResponseToIdentityUserResponse(
    response: ReqResSingleUserResponse,
): IdentityUserResponse {
    return {
        user: mapReqResUserToIdentityUser(response.data),
    };
}