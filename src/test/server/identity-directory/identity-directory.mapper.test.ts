/**
 * Tests the BFF data-shaping boundary.
 *
 * This test checks whether the server sanitizes and shapes third-party data before exposing it to the client.
 * 
 */

import { describe, expect, it } from 'vitest';
import { mapReqResUserToIdentityUser } from '@/server/identity-directory/identity-directory.mapper';

describe('mapReqResUserToIdentityUser', () => {
    it('maps raw ReqRes user data into a client-safe identity user contract', () => {
        const result = mapReqResUserToIdentityUser({
            id: 2,
            email: 'janet.weaver@reqres.in',
            first_name: 'Janet',
            last_name: 'Weaver',
            avatar: 'https://reqres.in/img/faces/2-image.jpg',
        });

        expect(result).toEqual({
            id: 2,
            displayName: 'Janet Weaver',
            email: 'janet.weaver@reqres.in',
            avatarUrl: 'https://reqres.in/img/faces/2-image.jpg',
            requiresMFA: true,
            identityAssuranceLevel: 'enhanced',
        });
    });

    it('does not expose raw upstream field names to the frontend contract', () => {
        const result = mapReqResUserToIdentityUser({
            id: 1,
            email: 'george.bluth@reqres.in',
            first_name: 'George',
            last_name: 'Bluth',
            avatar: 'https://reqres.in/img/faces/1-image.jpg',
        });

        expect(result).not.toHaveProperty('first_name');
        expect(result).not.toHaveProperty('last_name');
        expect(result).not.toHaveProperty('avatar');
    });
});