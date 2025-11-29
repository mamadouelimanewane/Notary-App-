import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BillingService } from '@/lib/billing/service';

// GET /api/billing/invoices/[id] - Get invoice with payments
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const invoice = BillingService.getInvoiceWithPayments(params.id);
        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json(invoice);
    } catch (error: any) {
        console.error('Error fetching invoice:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH /api/billing/invoices/[id] - Update invoice status
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { status } = await request.json();
        if (!status) {
            return NextResponse.json({ error: 'Status required' }, { status: 400 });
        }

        const invoice = BillingService.updateInvoiceStatus(params.id, status);
        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json(invoice);
    } catch (error: any) {
        console.error('Error updating invoice:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
