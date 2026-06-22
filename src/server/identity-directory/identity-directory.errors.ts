/**
 * Defines domain-specific errors for the identity directory server layer.
 *
 * These errors help the BFF route handlers translate upstream failures into
 * stable HTTP responses without leaking ReqRes implementation details to the
 * frontend.
 */

export class IdentityDirectoryUpstreamError extends Error {
    constructor(public readonly statusCode: number) {
        super(`Identity directory upstream request failed with status ${statusCode}`);
        this.name = 'IdentityDirectoryUpstreamError';
    }
}

export class IdentityDirectoryNotFoundError extends Error {
    constructor(userId: number) {
        super(`Identity user with id ${userId} was not found`);
        this.name = 'IdentityDirectoryNotFoundError';
    }
}