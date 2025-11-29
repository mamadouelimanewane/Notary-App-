import { NextRequest, NextResponse } from 'next/server';
import { FinancialStatementsService } from '@/lib/accounting/financial-statements-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const accountCode = searchParams.get('accountCode');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!accountCode || !startDate || !endDate) {
            return NextResponse.json(
                { error: 'Account code, start date, and end date are required' },
                { status: 400 }
            );
        }

        const ledger = FinancialStatementsService.generateLedger({
            accountCode,
            startDate,
            endDate
        });

        return NextResponse.json(ledger);
    } catch (error) {
        console.error('Error generating ledger:', error);
        return NextResponse.json(
            { error: 'Failed to generate ledger' },
            { status: 500 }
        );
    }
}
