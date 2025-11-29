import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TaxationEngine } from '@/lib/taxation/engine';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { templateId, amount } = body;

        if (!templateId || amount === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const template = db.actTemplates.find(t => t.id === templateId);
        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        const taxes = db.taxes;
        const result = TaxationEngine.calculate(template, parseFloat(amount), taxes);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Simulation error:', error);
        return NextResponse.json({ error: 'Failed to run simulation' }, { status: 500 });
    }
}
