// API route pour changer le statut d'une formalité

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { FormaliteService } from '@/lib/formalite-service';
import { FormaliteStatus } from '@/types/formalite-types';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const user = db.users.find(u => u.email === session.user.email);
        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        const { statut, commentaire } = await request.json();

        if (!Object.values(FormaliteStatus).includes(statut)) {
            return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
        }

        const updated = FormaliteService.updateStatus(
            params.id,
            statut,
            commentaire || '',
            user.id
        );

        if (!updated) {
            return NextResponse.json({ error: 'Formalité non trouvée' }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Erreur lors du changement de statut:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
