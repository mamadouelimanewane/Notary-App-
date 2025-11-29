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

        const balance = FinancialStatementsService.generateBalance({
            startDate,
            endDate
        });

        return NextResponse.json(balance);
    } catch (error) {
        console.error('Error generating balance:', error);
        return NextResponse.json(
            { error: 'Failed to generate balance' },
            { status: 500 }
        );
    }
}
