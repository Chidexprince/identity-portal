/**
 * Default MSW request handlers for identity directory tests.
 *
 * These handlers mock the internal BFF routes, not ReqRes. because
 * the frontend contract is browser -> BFF, while ReqRes remains server-side.
 */

import { http, HttpResponse } from 'msw';
import type {
    IdentityUserResponse,
    IdentityUsersResponse,
} from '@/features/identity-directory/types/identity-user';

const user = {
    id: 1,
    email: 'george.bluth@reqres.in',
    displayName: 'George Bluth',
    avatarUrl: 'https://reqres.in/img/faces/1-image.jpg',
    requiresMFA: true,
    accountStatus: 'active',
} as const;

export const handlers = [
    http.get('/api/users', () => {
        return HttpResponse.json<IdentityUsersResponse>({
            users: [user],
            perPage: 4,
            page: 1,
            total: 1,
            totalPages: 1,
        });
    }),

    http.get('/api/users/:id', ({ params }) => {
        const { id } = params;

        if (id !== '1') {
            return HttpResponse.json(
                { message: 'Identity user not found.' },
                { status: 404 },
            );
        }

        return HttpResponse.json<IdentityUserResponse>({
            user: user,
        });
    }),
];