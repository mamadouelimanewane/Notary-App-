import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const fromAccount = searchParams.get('fromAccount');
        const toAccount = searchParams.get('toAccount');

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: 'Start date and end date are required' },
                { status: 400 }
            );
        }

        let accounts = db.accounts;
        const allEntries = db.accountEntries;
        const journalEntries = db.journalEntries;

        // Filter accounts if range provided
        if (fromAccount) {
            accounts = accounts.filter(a => a.code >= fromAccount);
        }
        if (toAccount) {
            accounts = accounts.filter(a => a.code <= toAccount);
        }

        // Create a map for fast lookup of journal entry details
        const journalEntryMap = new Map<string, any>();
        journalEntries.forEach(je => {
            journalEntryMap.set(je.id, je);
        });

        const ledgerData = accounts.map(account => {
            let openingDebit = 0;
            let openingCredit = 0;
            const periodEntries: any[] = [];

            // Filter entries for this account
            const accountEntries = allEntries.filter(ae => ae.accountCode === account.code);

            accountEntries.forEach(entry => {
                const journalEntry = journalEntryMap.get(entry.journalEntryId);
                if (!journalEntry) return;

                const date = journalEntry.date;

                if (date < startDate) {
                    openingDebit += entry.debit;
                    openingCredit += entry.credit;
                } else if (date >= startDate && date <= endDate) {
                    periodEntries.push({
                        ...entry,
                        date: journalEntry.date,
                        reference: journalEntry.reference,
                        journalLabel: journalEntry.label, // Or journal code?
                        journalCode: db.journals.find(j => j.id === journalEntry.journalId)?.code || 'OD'
                    });
                }
            });

            // Sort entries by date
            periodEntries.sort((a, b) => a.date.localeCompare(b.date));

            const openingBalance = openingDebit - openingCredit;

            // Calculate closing balance
            const periodDebit = periodEntries.reduce((sum, e) => sum + e.debit, 0);
            const periodCredit = periodEntries.reduce((sum, e) => sum + e.credit, 0);
            const closingBalance = openingBalance + periodDebit - periodCredit;

            return {
                code: account.code,
                label: account.label,
                openingBalance,
                entries: periodEntries,
                totalDebit: periodDebit,
                totalCredit: periodCredit,
                closingBalance
            };
        });

        // Filter out accounts with no activity and no opening balance
        const activeLedger = ledgerData.filter(acc =>
            acc.openingBalance !== 0 || acc.entries.length > 0
        );

        return NextResponse.json(activeLedger);
    } catch (error) {
        console.error('Error generating ledger:', error);
        return NextResponse.json({ error: 'Failed to generate ledger' }, { status: 500 });
    }
}
