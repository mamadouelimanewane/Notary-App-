import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const clients = db.clients.filter(c => !c.isDeleted);

        return NextResponse.json({
            success: true,
            clients
        });
    } catch (error) {
        console.error('Error fetching clients:', error);
        return NextResponse.json(
            { error: 'Failed to fetch clients' },
            { status: 500 }
        );
    }
}
