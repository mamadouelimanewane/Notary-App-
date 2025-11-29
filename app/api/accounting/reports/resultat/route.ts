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

        const journalEntryDates = new Map<string, string>();
        journalEntries.forEach(je => {
            journalEntryDates.set(je.id, je.date);
        });

        // Helper to get balance of a class or prefix
        const getBalance = (prefix: string) => {
            let balance = 0;
            const targetAccounts = accounts.filter(a => a.code.startsWith(prefix));

            targetAccounts.forEach(account => {
                const accountEntries = allEntries.filter(ae => ae.accountCode === account.code);
                accountEntries.forEach(entry => {
                    const date = journalEntryDates.get(entry.journalEntryId);
                    if (date && date >= startDate && date <= endDate) {
                        balance += entry.credit - entry.debit; // For P&L: Credit is positive (Product), Debit is negative (Charge)
                    }
                });
            });
            return balance;
        };

        // 1. Produits d'Exploitation (Class 70-75)
        const produitsExploitation = getBalance('70') + getBalance('71') + getBalance('72') + getBalance('73') + getBalance('74') + getBalance('75');

        // 2. Charges d'Exploitation (Class 60-65)
        // Note: getBalance returns Credit - Debit. Charges are usually Debit, so result will be negative.
        // We want the absolute value for display, but keep sign for calculation?
        // Let's keep strict accounting sign: Products (+), Charges (-)
        const chargesExploitation = getBalance('60') + getBalance('61') + getBalance('62') + getBalance('63') + getBalance('64') + getBalance('65');

        // 3. Résultat d'Exploitation
        const resultatExploitation = produitsExploitation + chargesExploitation;

        // 4. Produits Financiers (77)
        const produitsFinanciers = getBalance('77');

        // 5. Charges Financières (67)
        const chargesFinancieres = getBalance('67');

        // 6. Résultat Financier
        const resultatFinancier = produitsFinanciers + chargesFinancieres;

        // 7. Résultat des Activités Ordinaires (RAO)
        const rao = resultatExploitation + resultatFinancier;

        // 8. Produits HAO (82, 84, 86, 88)
        const produitsHAO = getBalance('82') + getBalance('84') + getBalance('86') + getBalance('88');

        // 9. Charges HAO (81, 83, 85, 87)
        const chargesHAO = getBalance('81') + getBalance('83') + getBalance('85') + getBalance('87');

        // 10. Résultat HAO
        const resultatHAO = produitsHAO + chargesHAO;

        // 11. Impôts sur le résultat (89)
        const impots = getBalance('89');

        // 12. Résultat Net
        const resultatNet = rao + resultatHAO + impots;

        return NextResponse.json({
            produitsExploitation,
            chargesExploitation: Math.abs(chargesExploitation), // Send positive for display
            resultatExploitation,
            produitsFinanciers,
            chargesFinancieres: Math.abs(chargesFinancieres),
            resultatFinancier,
            rao,
            produitsHAO,
            chargesHAO: Math.abs(chargesHAO),
            resultatHAO,
            impots: Math.abs(impots),
            resultatNet
        });
    } catch (error) {
        console.error('Error generating Compte de Résultat:', error);
        return NextResponse.json({ error: 'Failed to generate Compte de Résultat' }, { status: 500 });
    }
}
