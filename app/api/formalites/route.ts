// API route pour la gestion des formalités

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { FormaliteService } from '@/lib/formalite-service';
import type { FormaliteFilters } from '@/types/formalite-types';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        // Construire les filtres depuis les query params
        const filters: FormaliteFilters = {};

        const statut = searchParams.get('statut');
        if (statut) filters.statut = statut.split(',') as any[];

        const type = searchParams.get('type');
        if (type) filters.type = type.split(',') as any[];

        const priorite = searchParams.get('priorite');
        if (priorite) filters.priorite = priorite.split(',') as any[];

        const acteId = searchParams.get('acteId');
        if (acteId) filters.acteId = acteId;

        const dossierId = searchParams.get('dossierId');
        if (dossierId) filters.dossierId = dossierId;

        const responsable = searchParams.get('responsable');
        if (responsable) filters.responsable = responsable;

        const dateDebut = searchParams.get('dateDebut');
        if (dateDebut) filters.dateDebut = dateDebut;

        const dateFin = searchParams.get('dateFin');
        if (dateFin) filters.dateFin = dateFin;

        const enRetard = searchParams.get('enRetard');
        if (enRetard === 'true') filters.enRetard = true;

        // Récupérer toutes les formalités
        let formalites = db.formalites;

        // Appliquer les filtres
        if (Object.keys(filters).length > 0) {
            formalites = FormaliteService.applyFilters(formalites, filters);
        }

        // Enrichir avec les informations des actes et dossiers
        const enrichedFormalites = formalites.map(f => {
            const acte = db.getActe(f.acteId);
            const dossier = db.dossiers.find(d => d.id === f.dossierId);
            const client = dossier ? db.getClient(dossier.clientId) : null;

            return {
                ...f,
                acte: acte ? { id: acte.id, type: acte.type, title: acte.title } : null,
                dossier: dossier ? { id: dossier.id, ref: dossier.ref, title: dossier.title } : null,
                client: client ? { id: client.id, firstName: client.firstName, lastName: client.lastName } : null,
                isEnRetard: FormaliteService.isEnRetard(f),
                joursRestants: FormaliteService.getJoursRestants(f)
            };
        });

        return NextResponse.json(enrichedFormalites);
    } catch (error) {
        console.error('Erreur lors de la récupération des formalités:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const user = db.users.find(u => u.email === session.user.email);
        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        const data = await request.json();

        // Créer la formalité
        const formalite = FormaliteService.createFormalite(data, user.id);

        return NextResponse.json(formalite, { status: 201 });
    } catch (error) {
        console.error('Erreur lors de la création de la formalité:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
