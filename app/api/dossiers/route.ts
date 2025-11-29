import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const dossiers = db.dossiers;

        return NextResponse.json({
            success: true,
            dossiers
        });
    } catch (error) {
        console.error('Error fetching dossiers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dossiers' },
            { status: 500 }
        );
    }
}
