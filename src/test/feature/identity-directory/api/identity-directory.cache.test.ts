/**
 * Tests the explicit TanStack Query cache lifecycle policy.
 *
 * This test protects the architectural decision from accidental changes.
 * 
 */

import { describe, expect, it } from 'vitest';
import { identityDirectoryCachePolicy } from '@/features/identity-directory/api/identity-directory.cache';

describe('identity directory cache policy', () => {
    it('uses the agreed cache lifecycle values for list and detail queries', () => {
        expect(identityDirectoryCachePolicy.usersList.staleTime).toBe(30 * 1000);
        expect(identityDirectoryCachePolicy.usersList.gcTime).toBe(2 * 60 * 1000);

        expect(identityDirectoryCachePolicy.userDetail.staleTime).toBe(10 * 1000);
        expect(identityDirectoryCachePolicy.userDetail.gcTime).toBe(60 * 1000);
    });

    it('keeps detail records more short-lived than the directory list', () => {
        expect(identityDirectoryCachePolicy.userDetail.staleTime).toBeLessThan(
            identityDirectoryCachePolicy.usersList.staleTime,
        );

        expect(identityDirectoryCachePolicy.userDetail.gcTime).toBeLessThan(
            identityDirectoryCachePolicy.usersList.gcTime,
        );
    });
});