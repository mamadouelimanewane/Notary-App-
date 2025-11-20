import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const signature = db.getUserSignature(session.user.id);

        if (!signature) {
            return NextResponse.json({ signature: null });
        }

        return NextResponse.json({
            signature: {
                id: signature.id,
                signatureData: signature.signatureData,
                createdAt: signature.createdAt,
            }
        });

    } catch (error) {
        console.error('Error retrieving signature:', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}
