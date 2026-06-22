/**
 * BFF route for the identity directory list.
 *
 * The browser calls this endpoint instead of calling ReqRes directly.
 * This allows the server to sanitize, enrich, and control the data contract.
 */

import { NextResponse } from 'next/server';
import { getIdentityUsers } from '@/server/identity-directory/identity-directory.service';

export async function GET() {
    try {
        const users = await getIdentityUsers();

        return NextResponse.json({ users });
    } catch {
        return NextResponse.json(
            {
                code: 'IDENTITY_USERS_FETCH_FAILED',
                message: 'Unable to load identity users.',
            },
            { status: 502 },
        );
    }
}