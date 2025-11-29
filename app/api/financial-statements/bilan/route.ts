import { NextRequest, NextResponse } from 'next/server';
import { FinancialStatementsService } from '@/lib/accounting/financial-statements-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const endDate = searchParams.get('endDate');

        if (!endDate) {
            return NextResponse.json(
                { error: 'End date is required' },
                { status: 400 }
            );
        }

        const bilan = FinancialStatementsService.generateBilan({
            endDate
        });

        return NextResponse.json(bilan);
    } catch (error) {
        console.error('Error generating bilan:', error);
        return NextResponse.json(
            { error: 'Failed to generate bilan' },
            { status: 500 }
        );
    }
}
