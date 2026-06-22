/**
 * Cache policy for identity-directory server state.
 *
 * Architectural rationale:
 * Identity data is more sensitive than low-risk reference data.
 * We want to avoid redundant API requests while ensuring identity-related data does not 
 * remain fresh or resident in memory for too long.
 * 
 *
 * staleTime:
 * - Controls how long data is considered fresh.
 * - While fresh, TanStack Query avoids unnecessary refetches.
 *
 * gcTime:
 * - Controls how long inactive query data remains in memory before garbage collection.
 * - This matters for sensitive identity data because inactive personal data should
 *   not linger indefinitely in browser memory.
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;

export const identityDirectoryCachePolicy = {
    /**
     * Directory list:
     * A short freshness window improves UX when users navigate back to the list,
     * while still allowing role/MFA/profile changes to refresh reasonably quickly.
     */
    usersList: {
        staleTime: 30 * SECOND,
        gcTime: 2 * MINUTE,
    },

    /**
     * User detail:
     * Detail data is more sensitive and potentially more authorization-relevant.
     * It becomes stale faster and is garbage-collected sooner once the modal closes.
     */
    userDetail: {
        staleTime: 10 * SECOND,
        gcTime: 1 * MINUTE,
    },
} as const;