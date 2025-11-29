// API Route - Récupération des dossiers du client
import { NextRequest, NextResponse } from 'next/server';
import { verifyClientToken } from '@/lib/client-portal-auth';
import { ClientPortalService } from '@/lib/client-portal';

export async function GET(request: NextRequest) {
    try {
        // Vérifier l'authentification
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const decoded = verifyClientToken(token);

        if (!decoded) {
            return NextResponse.json(
                { error: 'Token invalide' },
                { status: 401 }
            );
        }

        // Récupérer les dossiers du client
        const dossiers = await ClientPortalService.getClientDossiers(decoded.clientId);

        return NextResponse.json({
            success: true,
            dossiers
        });

    } catch (error) {
        console.error('Get dossiers error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des dossiers' },
            { status: 500 }
        );
    }
}
