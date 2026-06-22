/**
 * TanStack Query hook for loading the identity directory list.
 *
 * The list uses a short staleTime to reduce redundant refetching when the user
 * navigates around the dashboard, while gcTime ensures inactive identity data
 * is removed from memory quickly.
 */

import { useQuery } from '@tanstack/react-query';
import { identityDirectoryCachePolicy } from '../api/identity-directory.cache';
import { fetchIdentityUsers } from '../api/identity-directory.client';
import { identityDirectoryKeys } from '../api/identity-directory.keys';

export function useIdentityUsers() {
    return useQuery({
        queryKey: identityDirectoryKeys.users(),
        queryFn: fetchIdentityUsers,
        staleTime: identityDirectoryCachePolicy.usersList.staleTime,
        gcTime: identityDirectoryCachePolicy.usersList.gcTime,
    });
}