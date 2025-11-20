import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireAdmin } from '@/lib/adminMiddleware';
import { db } from '@/lib/db';

// GET - Liste tous les utilisateurs (admin uniquement)
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        await requireAdmin(session);

        const users = db.users.map(u => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            role: u.role,
            isActive: u.isActive,
            createdAt: u.createdAt,
            lastLogin: u.lastLogin
        }));

        return NextResponse.json({ users });

    } catch (error: any) {
        console.error('Error fetching users:', error);
        if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Créer un nouvel utilisateur (admin uniquement)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        await requireAdmin(session);

        const { firstName, lastName, email, password, role } = await req.json();

        // Validation
        if (!firstName || !lastName || !email || !password || !role) {
            return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
        }

        // Vérifier si l'email existe déjà
        const existingUser = db.users.find(u => u.email === email);
        if (existingUser) {
            return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
        }

        // Hash du mot de passe
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: `user-${Date.now()}`,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            createdAt: new Date().toISOString(),
            isActive: true
        };

        db.addUser(newUser);

        return NextResponse.json({
            success: true,
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating user:', error);
        if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
