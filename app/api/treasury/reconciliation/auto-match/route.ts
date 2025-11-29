import { NextRequest, NextResponse } from 'next/server';
import { BankReconciliationService } from '@/lib/accounting/bank-reconciliation-service';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { startDate, endDate, statementLines, journalEntries } = body;

        // Créer une session temporaire pour le matching automatique
        const session = BankReconciliationService.createReconciliationSession({
            bankAccountCode: '521',
            startDate,
            endDate,
            statementLines,
            userId: 'system'
        });

        // Récupérer les écritures de la période
        const entries = db.journalEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            const start = new Date(startDate);
            const end = new Date(endDate);

            const hasAccountMovement = entry.entries.some(e => e.accountCode === '521');
            const isInPeriod = entryDate >= start && entryDate <= end;

            return hasAccountMovement && isInPeriod;
        });

        // Rechercher les correspondances automatiques
        const matches = BankReconciliationService.findAutomaticMatches(session, entries);

        return NextResponse.json({
            success: true,
            matches
        });
    } catch (error) {
        console.error('Error in auto-match:', error);
        return NextResponse.json(
            { error: 'Failed to perform auto-match' },
            { status: 500 }
        );
    }
}
