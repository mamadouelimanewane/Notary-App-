import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

        // Calculate balances for all accounts
        const accountBalances = accounts.map(account => {
            let balance = 0;
            const accountEntries = allEntries.filter(ae => ae.accountCode === account.code);

            accountEntries.forEach(entry => {
                const date = journalEntryDates.get(entry.journalEntryId);
                if (date && date <= endDate) { // Bilan is cumulative from the beginning
                    balance += entry.debit - entry.credit;
                }
            });

            return { ...account, balance };
        }).filter(a => a.balance !== 0);

        // Buckets for Bilan
        const actif = {
            immobilise: 0, // Class 2
            stocks: 0,     // Class 3
            creances: 0,   // Class 4 (Debit)
            tresorerie: 0, // Class 5 (Debit)
            total: 0
        };

        const passif = {
            capitaux: 0,   // Class 1
            dettes: 0,     // Class 4 (Credit)
            tresorerie: 0, // Class 5 (Credit)
            resultat: 0,   // Calculated
            total: 0
        };

        accountBalances.forEach(acc => {
            const classCode = acc.code.charAt(0);
            const bal = acc.balance; // Positive = Debit, Negative = Credit

            if (classCode === '2') {
                actif.immobilise += bal;
            } else if (classCode === '3') {
                actif.stocks += bal;
            } else if (classCode === '4') {
                if (bal > 0) actif.creances += bal;
                else passif.dettes += Math.abs(bal);
            } else if (classCode === '5') {
                if (bal > 0) actif.tresorerie += bal;
                else passif.tresorerie += Math.abs(bal);
            } else if (classCode === '1') {
                passif.capitaux += Math.abs(bal); // Class 1 is naturally Credit (negative balance in our calc)
            }
            // Class 6, 7, 8, 9 are for Income Statement, not directly in Bilan lines (except via Result)
        });

        // Calculate Result (Profit/Loss)
        // Result = Total Actif - Total Passif (excluding result)
        // If Actif > Passif, we made a profit (Result is positive in Passif to balance)
        // If Passif > Actif, we made a loss (Result is negative in Passif)

        actif.total = actif.immobilise + actif.stocks + actif.creances + actif.tresorerie;
        const passifTemp = passif.capitaux + passif.dettes + passif.tresorerie;

        passif.resultat = actif.total - passifTemp;
        passif.total = passifTemp + passif.resultat;

        return NextResponse.json({ actif, passif });
    } catch (error) {
        console.error('Error generating bilan:', error);
        return NextResponse.json({ error: 'Failed to generate bilan' }, { status: 500 });
    }
}
