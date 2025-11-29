// API route pour les statistiques des formalités

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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

        const dossierId = searchParams.get('dossierId');
        if (dossierId) filters.dossierId = dossierId;

        const responsable = searchParams.get('responsable');
        if (responsable) filters.responsable = responsable;

        const stats = FormaliteService.getStats(filters);

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
