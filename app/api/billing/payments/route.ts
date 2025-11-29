import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BillingService } from '@/lib/billing/service';
import { db } from '@/lib/db';

// POST /api/billing/payments - Record a payment
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { invoiceId, amount, method, reference, notes } = await request.json();

        if (!invoiceId || !amount || !method) {
            return NextResponse.json(
                { error: 'Invoice ID, amount, and method are required' },
                { status: 400 }
            );
        }

        const payment = BillingService.recordPayment(
            invoiceId,
            amount,
            method,
            reference,
            notes,
            (session.user as any).id
        );

        return NextResponse.json(payment, { status: 201 });
    } catch (error: any) {
        console.error('Error recording payment:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET /api/billing/payments - Get payments by invoice or dossier
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const invoiceId = searchParams.get('invoiceId');
        const dossierId = searchParams.get('dossierId');

        let payments;
        if (invoiceId) {
            payments = db.getPaymentsByInvoice(invoiceId);
        } else if (dossierId) {
            payments = db.getPaymentsByDossier(dossierId);
        } else {
            payments = db.payments;
        }

        return NextResponse.json(payments);
    } catch (error: any) {
        console.error('Error fetching payments:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
