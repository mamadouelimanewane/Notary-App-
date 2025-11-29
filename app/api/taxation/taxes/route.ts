import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TaxDefinition } from '@/lib/taxation/types';

export async function GET() {
    try {
        const taxes = db.taxes;
        return NextResponse.json(taxes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch taxes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code, label, rate, type, accountCode, description } = body;

        if (!code || !label || rate === undefined || !type || !accountCode) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newTax: TaxDefinition = {
            id: crypto.randomUUID(),
            code,
            label,
            rate,
            type,
            accountCode,
            description
        };

        db.addTax(newTax);
        return NextResponse.json(newTax);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create tax' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const updatedTax = db.updateTax(id, updates);
        if (!updatedTax) {
            return NextResponse.json({ error: 'Tax not found' }, { status: 404 });
        }

        return NextResponse.json(updatedTax);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update tax' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const success = db.deleteTax(id);
        if (!success) {
            return NextResponse.json({ error: 'Tax not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete tax' }, { status: 500 });
    }
}
