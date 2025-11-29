import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q')?.toLowerCase();
        const type = searchParams.get('type') || 'all'; // 'all', 'actes', 'dossiers', 'clients'

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [] });
        }

        const results = [];

        // 1. Search Clients
        if (type === 'all' || type === 'clients') {
            const clients = db.clients.filter(c =>
                c.firstName.toLowerCase().includes(query) ||
                c.lastName.toLowerCase().includes(query) ||
                c.email.toLowerCase().includes(query) ||
                (c.companyName && c.companyName.toLowerCase().includes(query)) ||
                (c.ninea && c.ninea.toLowerCase().includes(query))
            );

            results.push(...clients.map(c => ({
                id: c.id,
                type: 'CLIENT',
                title: c.companyName ? `${c.companyName} (Entreprise)` : `${c.firstName} ${c.lastName}`,
                subtitle: c.email,
                description: `Client ${c.type.toLowerCase()} - ${c.city}`,
                url: `/dashboard/clients/${c.id}`,
                date: c.createdAt
            })));
        }

        // 2. Search Dossiers
        if (type === 'all' || type === 'dossiers') {
            const dossiers = db.dossiers.filter(d =>
                d.title.toLowerCase().includes(query) ||
                d.ref.toLowerCase().includes(query) ||
                d.type.toLowerCase().includes(query)
            );

            results.push(...dossiers.map(d => ({
                id: d.id,
                type: 'DOSSIER',
                title: d.title,
                subtitle: `Réf: ${d.ref}`,
                description: `Dossier ${d.status.toLowerCase()} - ${d.type}`,
                url: `/dashboard/dossiers/${d.id}`,
                date: d.createdAt,
                status: d.status
            })));
        }

        // 3. Search Actes (Deep Search)
        if (type === 'all' || type === 'actes') {
            const actes = db.actes.filter(a => {
                // Basic fields
                if (a.title.toLowerCase().includes(query) || a.type.toLowerCase().includes(query)) return true;

                // Metadata deep search (simulating full-text on structured data)
                if (a.metadata) {
                    const metaString = JSON.stringify(a.metadata).toLowerCase();
                    if (metaString.includes(query)) return true;
                }

                return false;
            });

            results.push(...actes.map(a => ({
                id: a.id,
                type: 'ACTE',
                title: a.title,
                subtitle: a.type,
                description: `Acte ${a.status.toLowerCase()} - Catégorie: ${a.category}`,
                url: `/dashboard/actes?id=${a.id}`, // Or a dedicated view
                date: a.createdAt,
                status: a.status
            })));
        }

        return NextResponse.json({ results });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
