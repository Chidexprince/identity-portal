/**
 * Defines the client-safe identity user contract returned by our BFF.
 *
 * Important:
 * The frontend must not consume the raw ReqRes payload directly.
 * This type represents the sanitized identity-directory model that the UI is
 * allowed to render.
 */

export type IdentityAccountStatus = 'active';

export interface IdentityUser {
    id: number;
    displayName: string;
    email: string;
    avatarUrl: string;
    requiresMFA: boolean;
    accountStatus: IdentityAccountStatus;
}

export interface IdentityUsersResponse {
    users: IdentityUser[];

    /**
   * Pagination metadata returned by the BFF.
   *
   * Keeping pagination in the domain response makes the directory scalable
   * to add page navigation, infinite scrolling, or server-side filtering.
   * 
   */
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
}

export interface IdentityUserResponse {
    user: IdentityUser;
}