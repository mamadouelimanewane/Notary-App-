import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Récupérer le nom de l'office (public, pour affichage)
export async function GET() {
    try {
        const settings = db.getSettings();

        return NextResponse.json({
            officeName: settings.officeName || 'Cabinet Notaire'
        });

    } catch (error) {
        console.error('Error fetching office name:', error);
        return NextResponse.json({
            officeName: 'Cabinet Notaire'
        }, { status: 200 });
    }
}
