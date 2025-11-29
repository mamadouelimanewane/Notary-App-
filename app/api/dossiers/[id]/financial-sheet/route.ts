import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { BillingIntegrationService } from '@/lib/accounting/billing-integration';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const dossierId = params.id;

        // Récupérer toutes les factures du dossier
        const invoices = db.getInvoicesByDossier(dossierId);

        // Récupérer tous les paiements liés aux factures
        const invoiceIds = invoices.map(inv => inv.id);
        const payments = db.payments.filter(p => invoiceIds.includes(p.invoiceId));

        // Récupérer toutes les écritures comptables liées au dossier
        const journalEntries = db.journalEntries.filter(
            entry => entry.dossierId === dossierId
        );

        return NextResponse.json({
            invoices,
            payments,
            journalEntries,
        });
    } catch (error) {
        console.error('Error fetching financial sheet:', error);
        return NextResponse.json(
            { error: 'Failed to fetch financial sheet' },
            { status: 500 }
        );
    }
}
