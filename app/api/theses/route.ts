import { NextRequest, NextResponse } from 'next/server';
import {
    getAllTheses,
    getThesisById,
    createThesis,
    updateThesis,
    deleteThesis
} from '@/lib/db';
import { extractToken, verifyToken } from '@/lib/auth';

// GET /api/theses - List all theses (public)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const filters = {
            search: searchParams.get('search') || undefined,
            fields: searchParams.get('fields')?.split(',') || undefined,
            year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
            university: searchParams.get('university') || undefined
        };

        const theses = await getAllTheses(filters);
        return NextResponse.json(theses, { status: 200 });
    } catch (error) {
        console.error('Error fetching theses:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: (error as Error).message },
            { status: 500 }
        );
    }
}

// POST /api/theses - Create new thesis (protected)
export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const authHeader = request.headers.get('authorization');
        const token = extractToken(authHeader || '');
        const user = verifyToken(token || '');

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const data = await request.json();

        // Validate required fields
        if (!data.title || !data.fields || !data.year || !data.thesis_url) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const thesis = await createThesis(data);
        return NextResponse.json(thesis, { status: 201 });
    } catch (error) {
        console.error('Error creating thesis:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: (error as Error).message },
            { status: 500 }
        );
    }
}
