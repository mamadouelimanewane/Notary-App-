import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { BalanceLine } from '@/lib/accounting/types';

export async function GET(request: Request) {
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

        const accounts = db.accounts;
        const allEntries = db.accountEntries;
        const journalEntries = db.journalEntries;

        // Create a map for fast lookup of journal entry dates
        const journalEntryDates = new Map<string, string>();
        journalEntries.forEach(je => {
            journalEntryDates.set(je.id, je.date);
        });

        const balanceLines: BalanceLine[] = accounts.map(account => {
            let debitOpening = 0;
            let creditOpening = 0;
            let debitMovement = 0;
            let creditMovement = 0;

            // Filter entries for this account
            // Optimization: In a real DB we would use aggregation queries.
            // Here we filter in memory.
            const accountEntries = allEntries.filter(ae => ae.accountCode === account.code);

            accountEntries.forEach(entry => {
                const date = journalEntryDates.get(entry.journalEntryId);
                if (!date) return; // Should not happen if integrity is maintained

                if (date < startDate) {
                    debitOpening += entry.debit;
                    creditOpening += entry.credit;
                } else if (date >= startDate && date <= endDate) {
                    debitMovement += entry.debit;
                    creditMovement += entry.credit;
                }
            });

            // Calculate Opening Balance (Solde à nouveau)
            // Usually we present it as either Debit or Credit
            const openingBalance = debitOpening - creditOpening;
            const finalDebitOpening = openingBalance > 0 ? openingBalance : 0;
            const finalCreditOpening = openingBalance < 0 ? Math.abs(openingBalance) : 0;

            // Calculate Closing Balance
            const totalDebit = finalDebitOpening + debitMovement;
            const totalCredit = finalCreditOpening + creditMovement;
            const closingBalance = totalDebit - totalCredit;

            const debitClosing = closingBalance > 0 ? closingBalance : 0;
            const creditClosing = closingBalance < 0 ? Math.abs(closingBalance) : 0;

            return {
                accountCode: account.code,
                accountLabel: account.label,
                debitOpening: finalDebitOpening,
                creditOpening: finalCreditOpening,
                debitMovement,
                creditMovement,
                debitClosing,
                creditClosing
            };
        });

        // Filter out accounts with no activity and no balance?
        // Usually General Balance shows all accounts with movement OR balance.
        const activeBalanceLines = balanceLines.filter(line =>
            line.debitOpening !== 0 ||
            line.creditOpening !== 0 ||
            line.debitMovement !== 0 ||
            line.creditMovement !== 0
        );

        // Sort by account code
        activeBalanceLines.sort((a, b) => a.accountCode.localeCompare(b.accountCode));

        return NextResponse.json(activeBalanceLines);
    } catch (error) {
        console.error('Error generating balance:', error);
        return NextResponse.json({ error: 'Failed to generate balance' }, { status: 500 });
    }
}
