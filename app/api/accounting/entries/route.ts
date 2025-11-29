import { NextResponse } from 'next/server';
import { journalService } from '@/lib/accounting/journal-service';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { journalId, date, label, entries, reference, dossierId } = body;

        if (!journalId || !date || !label || !entries || !Array.isArray(entries)) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create entry via service (which handles validation)
        const newEntry = journalService.createEntry(
            journalId,
            date,
            label,
            entries,
            reference,
            dossierId,
            'user-id-placeholder', // In real app, get from session
            body.validated // Pass validated flag
        );

        return NextResponse.json(newEntry);
    } catch (error: any) {
        console.error('Error creating journal entry:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create journal entry' },
            { status: 400 } // Return 400 for validation errors
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const accountCode = searchParams.get('accountCode');
        const journalId = searchParams.get('journalId');

        let entries = journalService.getEntries();

        if (journalId) {
            entries = entries.filter(e => e.journalId === journalId);
        }

        if (accountCode) {
            // Filter entries that have a line for this account
            // Note: journalService.getEntries returns JournalEntry[] which contains AccountEntry[]
            // We need to filter JournalEntries that contain at least one AccountEntry with the code
            // OR return AccountEntry[] directly?
            // For a Ledger, we usually want the AccountEntry details + Journal info.
            // Let's return AccountEntry objects enriched with Journal info for easier frontend display

            const accountEntries = db.getEntriesByAccount(accountCode);

            // Enrich with journal info (date, reference, label)
            const enrichedEntries = accountEntries.map((ae: any) => {
                const journalEntry = db.getJournalEntry(ae.journalEntryId);
                return {
                    ...ae,
                    date: journalEntry?.date,
                    reference: journalEntry?.reference,
                    journalLabel: journalEntry?.label
                };
            });

            return NextResponse.json(enrichedEntries);
        }

        return NextResponse.json(entries);
    } catch (error) {
        console.error('Error fetching journal entries:', error);
        return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
    }
}
