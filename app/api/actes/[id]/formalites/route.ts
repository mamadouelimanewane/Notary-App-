// API route pour gérer les formalités d'un acte

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { FormaliteService } from '@/lib/formalite-service';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const acte = db.getActe(params.id);
        if (!acte) {
            return NextResponse.json({ error: 'Acte non trouvé' }, { status: 404 });
        }

        const formalites = db.getFormalitesByActe(params.id);

        // Enrichir avec les informations supplémentaires
        const enriched = formalites.map(f => ({
            ...f,
            isEnRetard: FormaliteService.isEnRetard(f),
            joursRestants: FormaliteService.getJoursRestants(f)
        }));

        return NextResponse.json(enriched);
    } catch (error) {
        console.error('Erreur lors de la récupération des formalités de l\'acte:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(
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

        const acte = db.getActe(params.id);
        if (!acte) {
            return NextResponse.json({ error: 'Acte non trouvé' }, { status: 404 });
        }

        const { valeurActe } = await request.json();

        // Générer automatiquement les formalités pour cet acte
        const formalites = await FormaliteService.generateFormalitesForActe(
            acte.id,
            acte.dossierId,
            acte.type,
            valeurActe || 0,
            user.id
        );

        return NextResponse.json({
            message: `${formalites.length} formalité(s) générée(s) avec succès`,
            formalites
        }, { status: 201 });
    } catch (error) {
        console.error('Erreur lors de la génération des formalités:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
