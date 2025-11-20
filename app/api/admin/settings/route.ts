import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireAdmin } from '@/lib/adminMiddleware';
import { db } from '@/lib/db';

// GET - Récupérer les paramètres
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        await requireAdmin(session);

        const settings = db.getSettings();

        return NextResponse.json({ settings });

    } catch (error: any) {
        console.error('Error fetching settings:', error);
        if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Mettre à jour les paramètres
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        await requireAdmin(session);

        const updates = await req.json();

        const updatedSettings = db.updateSettings(updates);

        return NextResponse.json({
            success: true,
            settings: updatedSettings
        });

    } catch (error: any) {
        console.error('Error updating settings:', error);
        if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
