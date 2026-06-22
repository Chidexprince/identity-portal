/**
 * BFF route for a single identity user.
 *
 * Detail data is fetched separately to support a modal/detail view while keeping
 * list and detail cache lifecycles independently configurable in TanStack Query.
 */

import { NextResponse } from 'next/server';
import { getIdentityUserById } from '@/server/identity-directory/identity-directory.service';

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(_request: Request, context: RouteContext) {
    try {
        const { id } = await context.params;

        if (!id || Number.isNaN(Number(id))) {
            return NextResponse.json(
                {
                    code: 'INVALID_USER_ID',
                    message: 'A valid user id is required.',
                },
                { status: 400 },
            );
        }

        const user = await getIdentityUserById(id);

        return NextResponse.json({ user });
    } catch {
        return NextResponse.json(
            {
                code: 'IDENTITY_USER_FETCH_FAILED',
                message: 'Unable to load the selected identity user.',
            },
            { status: 502 },
        );
    }
}