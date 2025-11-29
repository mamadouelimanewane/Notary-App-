// API Route - Authentification Portail Client
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email et mot de passe requis' },
                { status: 400 }
            );
        }

        // TODO: Récupérer l'utilisateur depuis la base de données
        // Pour l'instant, simulation
        const user = {
            id: 'client_1',
            clientId: 'client_1',
            email: email,
            firstName: 'Jean',
            lastName: 'Dupont',
            hashedPassword: await bcrypt.hash('client123', 10), // Mot de passe par défaut
            isActive: true,
            isEmailVerified: true
        };

        // Vérifier le mot de passe
        const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Email ou mot de passe incorrect' },
                { status: 401 }
            );
        }

        if (!user.isActive) {
            return NextResponse.json(
                { error: 'Compte désactivé' },
                { status: 403 }
            );
        }

        // Générer le token JWT
        const token = jwt.sign(
            {
                userId: user.id,
                clientId: user.clientId,
                email: user.email,
                type: 'client_portal'
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Mettre à jour la dernière connexion
        // TODO: Sauvegarder dans la base de données

        return NextResponse.json({
            success: true,
            token,
            user: {
                id: user.id,
                clientId: user.clientId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isEmailVerified: user.isEmailVerified
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la connexion' },
            { status: 500 }
        );
    }
}
