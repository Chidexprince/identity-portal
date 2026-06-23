/**
 * TanStack Query hook for a single identity user.
 *
 * Detail records are treated as more sensitive than the directory list, so this
 * hook uses a shorter staleTime and gcTime. The query is disabled until a user
 * is selected to avoid fetching focused identity records unnecessarily.
 */

import { useQuery } from '@tanstack/react-query';
import { identityDirectoryCachePolicy } from '../api/identity-directory.cache';
import { fetchIdentityUserById } from '../api/identity-directory.client';
import { identityDirectoryKeys } from '../api/identity-directory.keys';

export type UseIdentityUserOptions = {
    userId: number | null;
};

export function useIdentityUser({ userId }: UseIdentityUserOptions) {
    return useQuery({
        queryKey:
            userId === null
                ? identityDirectoryKeys.userPlaceholder()
                : identityDirectoryKeys.user(userId),

        queryFn: () => {
            if (userId === null) {
                throw new Error('Cannot fetch identity user without a selected user id.');
            }

            return fetchIdentityUserById(userId);
        },

        enabled: userId !== null,

        staleTime: identityDirectoryCachePolicy.userDetail.staleTime,
        gcTime: identityDirectoryCachePolicy.userDetail.gcTime,
    });
}