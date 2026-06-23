/**
 * BFF route handler for a single identity user.
 *
 * The route validates the selected user id, calls the server-side identity
 * service, and returns the sanitized IdentityUserResponse directly.
 */

import { NextResponse } from 'next/server';
import {
    IdentityDirectoryNotFoundError,
    IdentityDirectoryUpstreamError,
} from '@/server/identity-directory/identity-directory.errors';
import { getIdentityUserById } from '@/server/identity-directory/identity-directory.service';

export const dynamic = 'force-dynamic';

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

function parseUserId(id: string): number | null {
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
        return null;
    }

    return userId;
}

export async function GET(_request: Request, context: RouteContext) {
    const { id } = await context.params;
    const userId = parseUserId(id);

    if (userId === null) {
        return NextResponse.json(
            { message: 'Invalid identity user id.' },
            {
                status: 400,
                headers: {
                    'Cache-Control': 'no-store',
                },
            },
        );
    }

    try {
        const identityUserResponse = await getIdentityUserById(userId);

        return NextResponse.json(identityUserResponse, {
            headers: {
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        if (error instanceof IdentityDirectoryNotFoundError) {
            return NextResponse.json(
                { message: 'Identity user not found.' },
                {
                    status: 404,
                    headers: {
                        'Cache-Control': 'no-store',
                    },
                },
            );
        }

        if (error instanceof IdentityDirectoryUpstreamError) {
            return NextResponse.json(
                { message: 'Unable to load identity user.' },
                {
                    status: 502,
                    headers: {
                        'Cache-Control': 'no-store',
                    },
                },
            );
        }

        return NextResponse.json(
            { message: 'Unexpected identity directory error.' },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store',
                },
            },
        );
    }
}