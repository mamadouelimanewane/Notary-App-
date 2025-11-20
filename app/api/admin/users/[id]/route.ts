import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireAdmin } from '@/lib/adminMiddleware';
import { db } from '@/lib/db';

// PUT - Modifier un utilisateur
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        await requireAdmin(session);

        const { id } = params;
        const updates = await req.json();

        // Ne pas permettre de modifier son propre statut actif
        if (id === session.user.id && updates.isActive === false) {
            return NextResponse.json({ error: 'Vous ne pouvez pas vous désactiver vous-même' }, { status: 400 });
        }

        // Si modification de mot de passe
        if (updates.password) {
            const bcrypt = require('bcryptjs');
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const updatedUser = db.updateUser(id, updates);

        if (!updatedUser) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                role: updatedUser.role,
                isActive: updatedUser.isActive
            }
        });

    } catch (error: any) {
        console.error('Error updating user:', error);
        if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Désactiver un utilisateur
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        await requireAdmin(session);

        const { id } = params;

        // Ne pas permettre de se désactiver soi-même
        if (id === session.user.id) {
            return NextResponse.json({ error: 'Vous ne pouvez pas vous désactiver vous-même' }, { status: 400 });
        }

        const success = db.deleteUser(id);

        if (!success) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error deleting user:', error);
        if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
