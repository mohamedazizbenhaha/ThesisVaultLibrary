import {
    getAllTheses,
    getThesisById,
    createThesis,
    updateThesis,
    deleteThesis
} from '../../lib/db.js';
import { extractToken, verifyToken } from '../../lib/auth.js';

export async function handler(event) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    try {
        const path = event.path;
        const method = event.httpMethod;
        const pathParts = path.split('/').filter(Boolean);
        const id = pathParts[pathParts.length - 1];

        // GET /api/theses - List all theses (public)
        if (method === 'GET' && !Number.isInteger(parseInt(id))) {
            const params = event.queryStringParameters || {};
            const filters = {
                search: params.search,
                fields: params.fields ? params.fields.split(',') : undefined,
                year: params.year ? parseInt(params.year) : undefined,
                publisher: params.publisher
            };

            const theses = await getAllTheses(filters);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(theses)
            };
        }

        // GET /api/theses/:id - Get single thesis (public)
        if (method === 'GET' && Number.isInteger(parseInt(id))) {
            const thesis = await getThesisById(parseInt(id));

            if (!thesis) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Thesis not found' })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(thesis)
            };
        }

        // Protected routes - require authentication
        const token = extractToken(event.headers.authorization || event.headers.Authorization);
        const user = verifyToken(token);

        if (!user) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Unauthorized' })
            };
        }

        // POST /api/theses - Create new thesis
        if (method === 'POST') {
            const data = JSON.parse(event.body);

            // Validate required fields
            if (!data.title || !data.fields || !data.year || !data.thesis_url) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Missing required fields' })
                };
            }

            const thesis = await createThesis(data);
            return {
                statusCode: 201,
                headers,
                body: JSON.stringify(thesis)
            };
        }

        // PUT /api/theses/:id - Update thesis
        if (method === 'PUT' && Number.isInteger(parseInt(id))) {
            const data = JSON.parse(event.body);
            const thesis = await updateThesis(parseInt(id), data);

            if (!thesis) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Thesis not found' })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(thesis)
            };
        }

        // DELETE /api/theses/:id - Delete thesis
        if (method === 'DELETE' && Number.isInteger(parseInt(id))) {
            const thesis = await deleteThesis(parseInt(id));

            if (!thesis) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Thesis not found' })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: 'Thesis deleted successfully', thesis })
            };
        }

        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Not found' })
        };
    } catch (error) {
        console.error('Theses API error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', message: error.message })
        };
    }
}
