/**
 * Centralized TanStack Query keys for the identity directory feature.
 *
 * Query keys are treated as the server-state cache contract. Keeping them in one
 * place makes invalidation, prefetching, testing, and future refactoring safer.
 */

export const identityDirectoryKeys = {
    all: ['identity-directory'] as const,

    users: () => [...identityDirectoryKeys.all, 'users'] as const,

    user: (userId: number) =>
        [...identityDirectoryKeys.all, 'users', userId] as const,

    /**
   * Placeholder key used when no user is selected.
   *
   * The query is disabled in this state, but TanStack Query still requires a
   * stable query key.
   */
    userPlaceholder: () =>
        [...identityDirectoryKeys.all, 'users', 'not-selected'] as const,
};