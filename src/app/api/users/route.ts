/**
 * BFF route handler for the identity users list.
 *
 * The frontend calls this route instead of calling ReqRes directly. The route
 * returns the sanitized IdentityUsersResponse produced by the server service.
 */

import { NextResponse } from 'next/server';
import { getIdentityUsers } from '@/server/identity-directory/identity-directory.service';

export async function GET() {
    try {
        const identityUsersResponse = await getIdentityUsers();

        return NextResponse.json(identityUsersResponse, {
            headers: {
                'Cache-Control': 'no-store',
            },
        });
    } catch {
        return NextResponse.json(
            {
                message: 'Unable to load identity users.',
            },
            {
                status: 502,
                headers: {
                    'Cache-Control': 'no-store',
                },
            },
        );
    }
}