import { NextResponse } from 'next/server';
import { setupAdminsTable } from '@/lib/db';

export async function GET() {
    try {
        await setupAdminsTable();
        return NextResponse.json({ message: 'Database initialized successfully' }, { status: 200 });
    } catch (error) {
        console.error('Setup error:', error);
        return NextResponse.json(
            { error: 'Failed to initialize database' },
            { status: 500 }
        );
    }
}
