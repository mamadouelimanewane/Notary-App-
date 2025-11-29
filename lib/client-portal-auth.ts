// Utilitaires d'authentification pour le portail client
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';

export interface ClientTokenPayload {
    userId: string;
    clientId: string;
    email: string;
    type: 'client_portal';
}

export function verifyClientToken(token: string): ClientTokenPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as ClientTokenPayload;

        if (decoded.type !== 'client_portal') {
            return null;
        }

        return decoded;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
}

export function generateClientToken(payload: Omit<ClientTokenPayload, 'type'>): string {
    return jwt.sign(
        {
            ...payload,
            type: 'client_portal'
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}
