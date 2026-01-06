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
        const admin = await getAdminByUsername(username);
        if (!admin) return false;

        // Simple string comparison as requested
        return admin.password === password;
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
