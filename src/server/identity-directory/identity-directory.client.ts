/**
 * Upstream client for the identity directory provider.
 *
 * This file adapts the generic server HTTP client to the ReqRes-backed
 * identity directory use case. It owns provider-specific details such as:
 * - base URL
 * - API key header
 * - ReqRes endpoint paths
 * - ReqRes response types
 *
 * The rest of the application should not know how ReqRes is called.
 */

import { getJson, ServerHttpError } from '@/server/shared/http/http-client';
import { getIdentityDirectoryConfig } from './identity-directory.config';
import { IdentityDirectoryUpstreamError } from './identity-directory.errors';
import type {
    ReqResSingleUserResponse,
    ReqResUsersResponse,
} from './identity-directory.types';

function buildReqResUrl(path: string): string {
    const { baseUrl } = getIdentityDirectoryConfig();

    return `${baseUrl}${path}`;
}

function getReqResHeaders(): HeadersInit {
    const { apiKey } = getIdentityDirectoryConfig();

    return {
        'x-api-key': apiKey,
    };
}

async function requestReqRes<TResponse>(path: string): Promise<TResponse> {
    try {
        return await getJson<TResponse>(buildReqResUrl(path), {
            headers: getReqResHeaders(),
        });
    } catch (error) {
        if (error instanceof ServerHttpError) {
            throw new IdentityDirectoryUpstreamError(error.statusCode);
        }

        throw error;
    }
}

export function fetchIdentityUsersFromUpstream(): Promise<ReqResUsersResponse> {
    return requestReqRes<ReqResUsersResponse>('/users?page=1');
}

export function fetchIdentityUserByIdFromUpstream(
    userId: number,
): Promise<ReqResSingleUserResponse> {
    return requestReqRes<ReqResSingleUserResponse>(`/users/${userId}`);
}