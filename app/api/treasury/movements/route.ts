import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TreasuryAccountingService } from '@/lib/accounting/treasury-accounting-service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            movementType,
            operationType,
            date,
            amount,
            accountCode,
            accountLabel,
            label,
            reference,
            dossierId,
            from,
            to
        } = body;

        let result;

        if (movementType === 'TRANSFER') {
            // Virement interne
            result = TreasuryAccountingService.recordInternalTransfer({
                date,
                amount,
                from,
                to,
                label,
                reference
            });
        } else if (movementType === 'BANK') {
            // Mouvement de banque
            result = TreasuryAccountingService.recordBankMovement({
                date,
                amount,
                type: operationType,
                accountCode,
                accountLabel,
                label,
                reference,
                dossierId
            });
        } else if (movementType === 'CASH') {
            // Mouvement de caisse
            result = TreasuryAccountingService.recordCashMovement({
                date,
                amount,
                type: operationType,
                accountCode,
                accountLabel,
                label,
                reference,
                dossierId
            });
        } else {
            return NextResponse.json(
                { error: 'Type de mouvement invalide' },
                { status: 400 }
            );
        }

        // Enregistrer l'écriture comptable
        const savedEntry = db.addJournalEntry(result.entry);

        return NextResponse.json({
            success: true,
            journalEntry: savedEntry
        });
    } catch (error) {
        console.error('Error creating treasury movement:', error);
        return NextResponse.json(
            { error: 'Failed to create treasury movement' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // 'bank' or 'cash'
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: 'Start date and end date are required' },
                { status: 400 }
            );
        }

        let movements;
        let balance;

        if (type === 'bank') {
            movements = TreasuryAccountingService.getBankMovements({
                startDate,
                endDate
            });
            balance = TreasuryAccountingService.getBankBalance();
        } else if (type === 'cash') {
            movements = TreasuryAccountingService.getCashMovements({
                startDate,
                endDate
            });
            balance = TreasuryAccountingService.getCashBalance();
        } else {
            return NextResponse.json(
                { error: 'Invalid type. Must be "bank" or "cash"' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            movements,
            balance
        });
    } catch (error) {
        console.error('Error fetching treasury movements:', error);
        return NextResponse.json(
            { error: 'Failed to fetch treasury movements' },
            { status: 500 }
        );
    }
}
