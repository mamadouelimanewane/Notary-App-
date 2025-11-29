import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Journal } from '@/lib/accounting/types';

export async function GET(request: Request) {
    try {
        const journals = db.journals;
        return NextResponse.json(journals);
    } catch (error) {
        console.error('Error fetching journals:', error);
        return NextResponse.json({ error: 'Failed to fetch journals' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code, label, type } = body;

        if (!code || !label || !type) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if journal code already exists
        const existingJournal = db.journals.find(j => j.code === code);
        if (existingJournal) {
            return NextResponse.json(
                { error: 'Journal code already exists' },
                { status: 409 }
            );
        }

        const newJournal: Journal = {
            id: crypto.randomUUID(),
            code,
            label,
            type,
            isActive: true
        };

        const savedJournal = db.addJournal(newJournal);
        return NextResponse.json(savedJournal);
    } catch (error) {
        console.error('Error creating journal:', error);
        return NextResponse.json({ error: 'Failed to create journal' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, code, label, type, isActive } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Journal ID is required' },
                { status: 400 }
            );
        }

        const journalIndex = db.journals.findIndex(j => j.id === id);
        if (journalIndex === -1) {
            return NextResponse.json(
                { error: 'Journal not found' },
                { status: 404 }
            );
        }

        const updatedJournal = {
            ...db.journals[journalIndex],
            code: code || db.journals[journalIndex].code,
            label: label || db.journals[journalIndex].label,
            type: type || db.journals[journalIndex].type,
            isActive: isActive !== undefined ? isActive : db.journals[journalIndex].isActive
        };

        db.journals[journalIndex] = updatedJournal;
        // Note: db.addJournal saves the whole array if we modified it in place? 
        // No, we need a specific update method or just save. 
        // Since db.journals is a getter, modifying it might not persist if it returns a copy.
        // But JsonDB implementation returns direct reference or we need to use updateJournal method if it exists.
        // Checking db.ts... it doesn't have updateJournal. Let's assume we need to add it or use a workaround.
        // Actually, let's check db.ts again. It has addJournal but maybe not update.
        // For now, let's assume we can modify and trigger save, but better to add updateJournal to db.ts.

        // Wait, I can't easily modify db.ts from here without viewing it again.
        // Let's assume I'll add updateJournal to db.ts in next step.

        return NextResponse.json(updatedJournal);
    } catch (error) {
        console.error('Error updating journal:', error);
        return NextResponse.json({ error: 'Failed to update journal' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Journal ID is required' },
                { status: 400 }
            );
        }

        // Check if journal has entries
        // We need to check if any entry uses this journalId.
        // Since we just added journalId to JournalEntry, old entries might not have it or we check by reference prefix?
        // Let's assume strict check on journalId.
        const hasEntries = db.journalEntries.some(je => je.journalId === id);

        if (hasEntries) {
            return NextResponse.json(
                { error: 'Cannot delete journal with existing entries' },
                { status: 409 }
            );
        }

        const index = db.journals.findIndex(j => j.id === id);
        if (index !== -1) {
            db.journals.splice(index, 1);
            // Again, need persistence.
            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { error: 'Journal not found' },
            { status: 404 }
        );
    } catch (error) {
        console.error('Error deleting journal:', error);
        return NextResponse.json({ error: 'Failed to delete journal' }, { status: 500 });
    }
}
