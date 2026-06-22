/**
 * Defines the client-safe identity user contract returned by BFF.
 *
 * Important:
 * The frontend must not consume the raw ReqRes payload directly.
 * This type represents the sanitized identity-directory model that the UI is allowed to render.
 */

export type IdentityAssuranceLevel = 'standard' | 'enhanced';

export interface IdentityUser {
    id: number;
    displayName: string;
    email: string;
    avatarUrl: string;
    requiresMFA: boolean;
    identityAssuranceLevel: IdentityAssuranceLevel;
}