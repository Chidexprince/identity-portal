/**
 * Maps raw ReqRes users into the client-safe IdentityUser contract.
 *
 * Security/architecture decision:
 * The frontend is treated as "untrusted" and never receives the raw third-party payload.
 * This mapper gives the BFF a clear place to sanitize, rename, enrich, or remove fields.
 */

import type { IdentityUser } from '@/features/identity-directory/types/identity-user';
import type { ReqResUser } from './identity-directory.types';

export function mapReqResUserToIdentityUser(user: ReqResUser): IdentityUser {
    return {
        id: user.id,
        displayName: `${user.first_name} ${user.last_name}`,
        email: user.email,
        avatarUrl: user.avatar,

        /**
         * Mock server-side identity policy flag.
         *
         * In a real Entra ID-backed portal, this could come from conditional access,
         * user risk, group membership, or identity-governance policy.
         */
        requiresMFA: true,

        /**
         * Simulated domain enrichment.
         *
         * This avoids making the client infer identity rules from raw API data.
         */
        identityAssuranceLevel: user.id % 2 === 0 ? 'enhanced' : 'standard',
    };
}