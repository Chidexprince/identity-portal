/**
 * Client-side API functions for the identity directory feature.
 *
 * This module is domain-specific. It does not call ReqRes and it does not own
 * low-level fetch mechanics. Instead, it calls the shared BFF client, which
 * only talks to internal Next.js route handlers.
 */

import { getBffJson } from '@/shared/api/bff-client';
import type {
    IdentityUserResponse,
    IdentityUsersResponse,
} from '../types/identity-user';

export function fetchIdentityUsers(): Promise<IdentityUsersResponse> {
    return getBffJson<IdentityUsersResponse>('/api/users');
}

export function fetchIdentityUserById(
    userId: number,
): Promise<IdentityUserResponse> {
    return getBffJson<IdentityUserResponse>(`/api/users/${userId}`);
}