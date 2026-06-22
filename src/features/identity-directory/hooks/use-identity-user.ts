/**
 * TanStack Query hook for loading a single identity user.
 *
 * The query is disabled until a user is selected. Detail data has a shorter
 * staleTime/gcTime than the list because detail views usually expose more
 * sensitive identity information.
 */

import { useQuery } from '@tanstack/react-query';
import { identityDirectoryCachePolicy } from '../api/identity-directory.cache';
import { fetchIdentityUserById } from '../api/identity-directory.client';
import { identityDirectoryKeys } from '../api/identity-directory.keys';

interface UseIdentityUserOptions {
    userId: number | null;
}

export function useIdentityUser({ userId }: UseIdentityUserOptions) {
    return useQuery({
        queryKey: userId
            ? identityDirectoryKeys.user(userId)
            : identityDirectoryKeys.user(0),
        queryFn: () => fetchIdentityUserById(userId as number),
        enabled: userId !== null,
        staleTime: identityDirectoryCachePolicy.userDetail.staleTime,
        gcTime: identityDirectoryCachePolicy.userDetail.gcTime,
    });
}