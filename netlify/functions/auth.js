import { generateToken, verifyCredentials } from '../../lib/auth.js';

export async function handler(event) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const { username, password } = JSON.parse(event.body);

        // Validate input
        if (!username || !password) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Username and password are required' })
            };
        }

        // Verify credentials
        if (verifyCredentials(username, password)) {
            const token = generateToken({ username, role: 'admin' });

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ token, username })
            };
        }

        return {
            statusCode: 401,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Invalid credentials' })
        };
    } catch (error) {
        console.error('Auth error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}
