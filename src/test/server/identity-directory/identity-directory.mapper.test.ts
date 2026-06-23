/**
 * Tests the BFF data-shaping boundary.
 *
 * This test checks whether the server sanitizes and shapes third-party data before exposing it to the client.
 * 
 */

import { describe, expect, it } from 'vitest';
import {
    mapReqResSingleUserResponseToIdentityUserResponse,
    mapReqResUserToIdentityUser,
    mapReqResUsersResponseToIdentityUsersResponse,
} from '@/server/identity-directory/identity-directory.mapper';
import type {
    ReqResSingleUserResponse,
    ReqResUser,
    ReqResUsersResponse,
} from '@/server/identity-directory/identity-directory.types';

const reqResUser: ReqResUser = {
    id: 1,
    email: 'george.bluth@reqres.in',
    first_name: 'George',
    last_name: 'Bluth',
    avatar: 'https://reqres.in/img/faces/1-image.jpg',
};

describe('identity directory mapper', () => {
    it('maps a ReqRes user into a client-safe identity user contract', () => {
        const result = mapReqResUserToIdentityUser(reqResUser);

        expect(result).toEqual({
            id: 1,
            email: 'george.bluth@reqres.in',
            displayName: 'George Bluth',
            avatarUrl: 'https://reqres.in/img/faces/1-image.jpg',
            requiresMFA: true,
            accountStatus: 'active',
        });

        expect(result).not.toHaveProperty('first_name');
        expect(result).not.toHaveProperty('last_name');
        expect(result).not.toHaveProperty('avatar');
    });

    it('maps the list response and preserves normalized pagination metadata', () => {
        const response: ReqResUsersResponse = {
            page: 1,
            per_page: 6,
            total: 12,
            total_pages: 2,
            data: [reqResUser],
        };

        const result = mapReqResUsersResponseToIdentityUsersResponse(response);

        expect(result.users).toHaveLength(1);
        expect(result.page).toBe(1);
        expect(result.total).toBe(12);
        expect(result.totalPages).toBe(2);
    });

    it('maps the single-user response into the detail response contract', () => {
        const response: ReqResSingleUserResponse = {
            data: reqResUser,
        };

        const result = mapReqResSingleUserResponseToIdentityUserResponse(response);

        expect(result.user.displayName).toBe('George Bluth');
        expect(result.user.requiresMFA).toBe(true);
    });
});