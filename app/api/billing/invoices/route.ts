import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BillingService } from '@/lib/billing/service';
import { db } from '@/lib/db';

// GET /api/billing/invoices - Get all invoices or filter by dossier/client
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const dossierId = searchParams.get('dossierId');
        const clientId = searchParams.get('clientId');

        let invoices;
        if (dossierId) {
            invoices = BillingService.getDossierInvoices(dossierId);
        } else if (clientId) {
            invoices = BillingService.getClientInvoices(clientId);
        } else {
            invoices = [...db.invoices]; // Convert to plain array
        }

        return NextResponse.json(invoices);
    } catch (error: any) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/billing/invoices - Create invoice from acte
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { acteId } = await request.json();
        if (!acteId) {
            return NextResponse.json({ error: 'Acte ID required' }, { status: 400 });
        }

        const acte = db.getActe(acteId);
        if (!acte) {
            return NextResponse.json({ error: 'Acte not found' }, { status: 404 });
        }

        const invoice = BillingService.generateInvoiceFromActe(acte);
        return NextResponse.json(invoice, { status: 201 });
    } catch (error: any) {
        console.error('Error creating invoice:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
