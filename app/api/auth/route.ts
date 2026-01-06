import { NextRequest, NextResponse } from 'next/server';
import { generateToken, verifyCredentials } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Validate input
        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Verify credentials
        if (await verifyCredentials(username, password)) {
            const token = generateToken({ username, role: 'admin' });

            return NextResponse.json({ token, username }, { status: 200 });
        }

        return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        );
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
