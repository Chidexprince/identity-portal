/**
 * Raw upstream response types from ReqRes.
 *
 * These are kept server-side because they represent the external
 * provider contract, not the client-safe identity-directory contract.
 */

export interface ReqResUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

export interface ReqResUsersResponse {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: ReqResUser[];
}

export interface ReqResSingleUserResponse {
    data: ReqResUser;
}