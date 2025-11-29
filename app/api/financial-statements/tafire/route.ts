import { NextRequest, NextResponse } from 'next/server';
import { FinancialStatementsService } from '@/lib/accounting/financial-statements-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: 'Start date and end date are required' },
                { status: 400 }
            );
        }

        const tafire = FinancialStatementsService.generateTafire({
            startDate,
            endDate
        });

        return NextResponse.json(tafire);
    } catch (error) {
        console.error('Error generating TAFIRE:', error);
        return NextResponse.json(
            { error: 'Failed to generate TAFIRE' },
            { status: 500 }
        );
    }
}
