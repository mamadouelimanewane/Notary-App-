// API route pour une formalité spécifique

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

        const formalite = db.getFormalite(params.id);

        if (!formalite) {
            return NextResponse.json({ error: 'Formalité non trouvée' }, { status: 404 });
        }

        // Enrichir avec les données associées
        const acte = db.getActe(formalite.acteId);
        const dossier = db.dossiers.find(d => d.id === formalite.dossierId);
        const client = dossier ? db.getClient(dossier.clientId) : null;
        const documents = db.getFormaliteDocuments(formalite.id);
        const historique = db.getFormaliteHistorique(formalite.id);

        const enriched = {
            ...formalite,
            acte: acte ? { id: acte.id, type: acte.type, title: acte.title } : null,
            dossier: dossier ? { id: dossier.id, ref: dossier.ref, title: dossier.title } : null,
            client: client ? { id: client.id, firstName: client.firstName, lastName: client.lastName } : null,
            documents,
            historique,
            isEnRetard: FormaliteService.isEnRetard(formalite),
            joursRestants: FormaliteService.getJoursRestants(formalite)
        };

        return NextResponse.json(enriched);
    } catch (error) {
        console.error('Erreur lors de la récupération de la formalité:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function PUT(
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

        const formalite = db.getFormalite(params.id);
        if (!formalite) {
            return NextResponse.json({ error: 'Formalité non trouvée' }, { status: 404 });
        }

        const updates = await request.json();
        updates.modifiePar = user.id;

        const updated = db.updateFormalite(params.id, updates);

        if (updated) {
            FormaliteService.addHistorique(
                params.id,
                'MODIFICATION',
                undefined,
                undefined,
                'Formalité modifiée',
                user.id
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la formalité:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const user = db.users.find(u => u.email === session.user.email);
        if (!user || (user.role !== 'ADMIN' && user.role !== 'NOTAIRE')) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        const success = db.deleteFormalite(params.id);

        if (!success) {
            return NextResponse.json({ error: 'Formalité non trouvée' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Formalité supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la formalité:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
