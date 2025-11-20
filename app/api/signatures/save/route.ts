import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { signatureData } = await req.json();

        if (!signatureData) {
            return NextResponse.json({ error: 'Données de signature manquantes' }, { status: 400 });
        }

        // Désactiver toutes les anciennes signatures de l'utilisateur
        db.deactivateUserSignatures(session.user.id);

        // Créer nouvelle signature
        const signature = {
            id: `sig-${uuidv4()}`,
            userId: session.user.id,
            signatureData,
            createdAt: new Date().toISOString(),
            isActive: true,
        };

        db.addSignature(signature);

        return NextResponse.json({
            success: true,
            signature: {
                id: signature.id,
                createdAt: signature.createdAt,
            }
        });

    } catch (error) {
        console.error('Err human uploading signature:', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}
