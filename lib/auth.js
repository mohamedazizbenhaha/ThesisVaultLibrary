import jwt from 'jsonwebtoken';

// Verify JWT token
export function verifyToken(token) {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// Generate JWT token
export function generateToken(payload) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
}

// Verify admin credentials using hardcoded hash
import crypto from 'crypto';

export async function verifyCredentials(username, password) {
    try {
        // Hardcoded secure credentials requested by user
        // Username: admin
        // Password: admin123
        const validUsername = 'admin';
        const validHash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'; // sha256 of admin123

        if (username !== validUsername) return false;

        const hash = crypto.createHash('sha256').update(password).digest('hex');
        return hash === validHash;
    } catch (error) {
        console.error('Verify credentials error:', error);
        return false;
    }
}

// Extract token from Authorization header
export function extractToken(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}
