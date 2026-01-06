import { NextRequest, NextResponse } from 'next/server';
import { getThesisById, updateThesis, deleteThesis } from '@/lib/db';
import { extractToken, verifyToken } from '@/lib/auth';

// GET /api/theses/[id] - Get single thesis (public)
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid thesis ID' },
                { status: 400 }
            );
        }

        const thesis = await getThesisById(id);

        if (!thesis) {
            return NextResponse.json(
                { error: 'Thesis not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(thesis, { status: 200 });
    } catch (error) {
        console.error('Error fetching thesis:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/theses/[id] - Update thesis (protected)
export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
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

        const params = await props.params;
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid thesis ID' },
                { status: 400 }
            );
        }

        const data = await request.json();
        const thesis = await updateThesis(id, data);

        if (!thesis) {
            return NextResponse.json(
                { error: 'Thesis not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(thesis, { status: 200 });
    } catch (error) {
        console.error('Error updating thesis:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/theses/[id] - Delete thesis (protected)
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
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

        const params = await props.params;
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid thesis ID' },
                { status: 400 }
            );
        }

        const thesis = await deleteThesis(id);

        if (!thesis) {
            return NextResponse.json(
                { error: 'Thesis not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Thesis deleted successfully', thesis },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting thesis:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
